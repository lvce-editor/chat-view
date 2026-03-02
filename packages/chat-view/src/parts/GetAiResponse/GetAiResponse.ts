import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import {
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { type GetOpenRouterAssistantTextErrorResult, getOpenRouterAssistantText } from './GetOpenRouterAssistantText.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'
import { isOpenRouterModel } from './IsOpenRouterModel.ts'

const getOpenRouterTooManyRequestsMessage = (errorResult: GetOpenRouterAssistantTextErrorResult): string => {
  const details: string[] = []
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

export const getAiResponse = async (
  userText: string,
  nextMessageId: number,
  selectedModelId: string,
  models: readonly ChatModel[],
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
): Promise<ChatMessage> => {
  let text = ''
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenRouterModel) {
    if (openRouterApiKey) {
      const result = await getOpenRouterAssistantText(userText, getOpenRouterModelId(selectedModelId), openRouterApiKey, openRouterApiBaseUrl)
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
  if (!text && !usesOpenRouterModel) {
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
