import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import {
  openApiApiKeyRequiredMessage,
  openApiRequestFailedMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
import * as ExtensionHostShared from '../ExtensionHost/ExtensionHostShared.ts'
import { CommandExecute } from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { type GetOpenApiAssistantTextErrorResult, getOpenApiAssistantText } from './GetOpenApiAssistantText.ts'
import { getOpenApiModelId } from './GetOpenApiModelId.ts'
import {
  type GetOpenRouterAssistantTextSuccessResult,
  type GetOpenRouterAssistantTextErrorResult,
  getOpenRouterAssistantText,
} from './GetOpenRouterAssistantText.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'
import { isOpenApiModel } from './IsOpenApiModel.ts'
import { isOpenRouterModel } from './IsOpenRouterModel.ts'

const getOpenRouterTooManyRequestsMessage = (errorResult: GetOpenRouterAssistantTextErrorResult): string => {
  const details: string[] = []
  if (errorResult.rawMessage) {
    details.push(errorResult.rawMessage)
  }
  const { limitInfo } = errorResult
  if (limitInfo) {
    if (limitInfo.retryAfter) {
      details.push(`Retry after: ${limitInfo.retryAfter}.`)
    }
    if (limitInfo.limitReset) {
      details.push(`Limit resets: ${limitInfo.limitReset}.`)
    }
    if (limitInfo.limitRemaining === null) {
      details.push('Credits remaining: unlimited.')
    } else if (typeof limitInfo.limitRemaining === 'number') {
      details.push(`Credits remaining: ${limitInfo.limitRemaining}.`)
    }
    if (typeof limitInfo.usageDaily === 'number') {
      details.push(`Credits used today (UTC): ${limitInfo.usageDaily}.`)
    }
    if (typeof limitInfo.usage === 'number') {
      details.push(`Credits used (all time): ${limitInfo.usage}.`)
    }
  }

  if (details.length === 0) {
    return openRouterTooManyRequestsMessage
  }

  return `${openRouterTooManyRequestsMessage} ${details.join(' ')}`
}

const getOpenRouterErrorMessage = (errorResult: GetOpenRouterAssistantTextErrorResult): string => {
  switch (errorResult.details) {
    case 'http-error':
    case 'request-failed':
      return openRouterRequestFailedMessage
    case 'too-many-requests':
      return getOpenRouterTooManyRequestsMessage(errorResult)
  }
}

const getOpenApiErrorMessage = (errorResult: GetOpenApiAssistantTextErrorResult): string => {
  switch (errorResult.details) {
    case 'http-error': {
      const errorMessage = errorResult.errorMessage?.trim()
      const hasErrorCode = typeof errorResult.errorCode === 'string' && errorResult.errorCode.length > 0
      const hasErrorType = typeof errorResult.errorType === 'string' && errorResult.errorType.length > 0

      if (errorResult.statusCode === 429) {
        let prefix = 'OpenAI rate limit exceeded (429)'
        if (hasErrorCode) {
          prefix = `OpenAI rate limit exceeded (429: ${errorResult.errorCode})`
        }
        if (hasErrorType) {
          prefix += ` [${errorResult.errorType}]`
        }
        prefix += '.'
        if (!errorMessage) {
          return prefix
        }
        return `${prefix} ${errorMessage}`
      }

      if (typeof errorResult.statusCode === 'number') {
        let prefix = `OpenAI request failed (status ${errorResult.statusCode})`
        if (hasErrorCode) {
          prefix += `: ${errorResult.errorCode}`
        }
        if (hasErrorType) {
          prefix += ` [${errorResult.errorType}]`
        }
        prefix += '.'
        if (!errorMessage) {
          return prefix
        }
        return `${prefix} ${errorMessage}`
      }

      if (errorMessage) {
        return `OpenAI request failed. ${errorMessage}`
      }
      return openApiRequestFailedMessage
    }
    case 'request-failed':
      return openApiRequestFailedMessage
  }
}

const normalizeLimitInfo = (value: unknown): GetOpenRouterAssistantTextErrorResult['limitInfo'] | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const limitRemaining = Reflect.get(value, 'limitRemaining')
  const limitReset = Reflect.get(value, 'limitReset')
  const retryAfter = Reflect.get(value, 'retryAfter')
  const usage = Reflect.get(value, 'usage')
  const usageDaily = Reflect.get(value, 'usageDaily')
  const normalized: GetOpenRouterAssistantTextErrorResult['limitInfo'] = {
    limitRemaining: typeof limitRemaining === 'number' || limitRemaining === null ? limitRemaining : undefined,
    limitReset: typeof limitReset === 'string' || limitReset === null ? limitReset : undefined,
    retryAfter: typeof retryAfter === 'string' || retryAfter === null ? retryAfter : undefined,
    usage: typeof usage === 'number' ? usage : undefined,
    usageDaily: typeof usageDaily === 'number' ? usageDaily : undefined,
  }
  const hasDetails =
    normalized.limitRemaining !== undefined ||
    normalized.limitReset !== undefined ||
    normalized.retryAfter !== undefined ||
    normalized.usage !== undefined ||
    normalized.usageDaily !== undefined
  return hasDetails ? normalized : undefined
}

const normalizeMockResult = (value: unknown): GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult => {
  if (typeof value === 'string') {
    return {
      text: value,
      type: 'success',
    }
  }
  if (!value || typeof value !== 'object') {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  const type = Reflect.get(value, 'type')
  if (type === 'success') {
    const text = Reflect.get(value, 'text')
    if (typeof text === 'string') {
      return {
        text,
        type: 'success',
      }
    }
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  if (type === 'error') {
    const details = Reflect.get(value, 'details')
    if (details === 'request-failed' || details === 'too-many-requests' || details === 'http-error') {
      const rawMessage = Reflect.get(value, 'rawMessage')
      const statusCode = Reflect.get(value, 'statusCode')
      return {
        details,
        limitInfo: normalizeLimitInfo(Reflect.get(value, 'limitInfo')),
        rawMessage: typeof rawMessage === 'string' ? rawMessage : undefined,
        statusCode: typeof statusCode === 'number' ? statusCode : undefined,
        type: 'error',
      }
    }
  }
  const text = Reflect.get(value, 'text')
  if (typeof text === 'string') {
    return {
      text,
      type: 'success',
    }
  }
  return {
    details: 'request-failed',
    type: 'error',
  }
}

const getMockOpenRouterAssistantText = async (
  messages: readonly ChatMessage[],
  modelId: string,
  openRouterApiBaseUrl: string,
  openRouterApiKey: string,
  mockApiCommandId: string,
  assetDir: string,
  platform: number,
): Promise<GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult> => {
  if (!mockApiCommandId) {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  try {
    const result = await ExtensionHostShared.executeProvider({
      assetDir,
      event: `onCommand:${mockApiCommandId}`,
      method: CommandExecute,
      noProviderFoundMessage: 'No mock api command found',
      params: [
        mockApiCommandId,
        {
          messages,
          modelId,
          openRouterApiBaseUrl,
          openRouterApiKey,
        },
      ],
      platform,
    })
    return normalizeMockResult(result)
  } catch {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
}

export const getAiResponse = async (
  userText: string,
  messages: readonly ChatMessage[],
  nextMessageId: number,
  selectedModelId: string,
  models: readonly ChatModel[],
  openApiApiKey: string,
  openApiApiBaseUrl: string,
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
  useMockApi: boolean,
  mockApiCommandId: string,
  assetDir: string,
  platform: number,
): Promise<ChatMessage> => {
  let text = ''
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenApiModel) {
    if (openApiApiKey) {
      const result = await getOpenApiAssistantText(messages, getOpenApiModelId(selectedModelId), openApiApiKey, openApiApiBaseUrl)
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenApiErrorMessage(result)
      }
    } else {
      text = openApiApiKeyRequiredMessage
    }
  } else if (usesOpenRouterModel) {
    const modelId = getOpenRouterModelId(selectedModelId)
    if (useMockApi) {
      const result = await getMockOpenRouterAssistantText(
        messages,
        modelId,
        openRouterApiBaseUrl,
        openRouterApiKey,
        mockApiCommandId,
        assetDir,
        platform,
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else if (openRouterApiKey) {
      const result = await getOpenRouterAssistantText(messages, modelId, openRouterApiKey, openRouterApiBaseUrl)
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else {
      text = openRouterApiKeyRequiredMessage
    }
  }
  if (!text && !usesOpenApiModel && !usesOpenRouterModel) {
    text = await getMockAiResponse(userText)
  }
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return {
    id: `message-${nextMessageId}`,
    role: 'assistant',
    text,
    time: assistantTime,
  }
}
