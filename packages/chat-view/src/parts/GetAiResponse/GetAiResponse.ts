/* eslint-disable prefer-destructuring */
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetAiResponseOptions } from '../GetAiResponseOptions/GetAiResponseOptions.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { defaultAgentMode } from '../AgentMode/AgentMode.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import {
  backendAccessTokenRequiredMessage,
  backendCompletionFailedMessage,
  backendUrlRequiredMessage,
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
} from '../ChatStrings/ChatStrings.ts'
import { executeChatTool, getBasicChatTools } from '../ChatTools/ChatTools.ts'
import { defaultMaxToolCalls } from '../DefaultMaxToolCalls/DefaultMaxToolCalls.ts'
import { getBackendErrorMessage } from '../GetBackendErrorMessage/GetBackendErrorMessage.ts'
import { getChatMessageOpenAiContent } from '../GetChatMessageOpenAiContent/GetChatMessageOpenAiContent.ts'
import { getClientRequestIdHeader } from '../GetClientRequestIdHeader/GetClientRequestIdHeader.ts'
import { getMockAiResponse } from '../GetMockAiResponse/GetMockAiResponse.ts'
import { getMockOpenApiAssistantText } from '../GetMockOpenApiAssistantText/GetMockOpenApiAssistantText.ts'
import { getMockOpenRouterAssistantText } from '../GetMockOpenRouterAssistantText/GetMockOpenRouterAssistantText.ts'
import { getOpenApiApiEndpoint } from '../GetOpenApiApiEndpoint/GetOpenApiApiEndpoint.ts'
import { getOpenApiAssistantText } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getOpenAiParams } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getToolCallExecutionStatus } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getToolCallResult } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getImageNotSupportedMessage, getOpenApiErrorMessage } from '../GetOpenApiErrorMessage/GetOpenApiErrorMessage.ts'
import { getOpenApiModelId } from '../GetOpenApiModelId/GetOpenApiModelId.ts'
import { getOpenRouterAssistantText } from '../GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts'
import { getOpenRouterErrorMessage } from '../GetOpenRouterErrorMessage/GetOpenRouterErrorMessage.ts'
import { getOpenRouterModelId } from '../GetOpenRouterModelId/GetOpenRouterModelId.ts'
import { isOpenApiModel } from '../IsOpenApiModel/IsOpenApiModel.ts'
import { isOpenRouterModel } from '../IsOpenRouterModel/IsOpenRouterModel.ts'
import * as MockBackendCompletion from '../MockBackendCompletion/MockBackendCompletion.ts'
import * as MockOpenApiRequest from '../MockOpenApiRequest/MockOpenApiRequest.ts'

const trailingSlashesRegex = /\/+$/

const getBackendResponsesEndpoint = (backendUrl: string): string => {
  const trimmedBackendUrl = backendUrl.replace(trailingSlashesRegex, '')
  return `${trimmedBackendUrl}/v1/responses`
}

const hasImageAttachments = (messages: readonly ChatMessage[]): boolean => {
  return messages.some((message) => message.attachments?.some((attachment) => attachment.displayType === 'image'))
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object'
}

const getBackendErrorMessageFromBody = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const directMessage = Reflect.get(body, 'message')
  if (typeof directMessage === 'string' && directMessage) {
    return directMessage
  }
  const directError = Reflect.get(body, 'error')
  if (typeof directError === 'string' && directError) {
    return directError
  }
  if (!isObject(directError)) {
    return undefined
  }
  const nestedMessage = Reflect.get(directError, 'message')
  if (typeof nestedMessage === 'string' && nestedMessage) {
    return nestedMessage
  }
  return undefined
}

const getBackendStatusCodeFromBody = (body: unknown): number | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const statusCode = Reflect.get(body, 'statusCode')
  if (typeof statusCode === 'number') {
    return statusCode
  }
  return undefined
}

const getBackendResponseOutputText = (body: unknown): string => {
  if (!isObject(body)) {
    return ''
  }
  const outputText = Reflect.get(body, 'output_text')
  if (typeof outputText === 'string' && outputText) {
    return outputText
  }
  const text = Reflect.get(body, 'text')
  if (typeof text === 'string' && text) {
    return text
  }
  const message = Reflect.get(body, 'message')
  if (isObject(message)) {
    const content = Reflect.get(message, 'content')
    if (typeof content === 'string' && content) {
      return content
    }
  }
  const choices = Reflect.get(body, 'choices')
  if (Array.isArray(choices)) {
    const firstChoice = choices[0]
    if (isObject(firstChoice)) {
      const firstMessage = Reflect.get(firstChoice, 'message')
      if (isObject(firstMessage)) {
        const content = Reflect.get(firstMessage, 'content')
        if (typeof content === 'string' && content) {
          return content
        }
      }
    }
  }
  const output = Reflect.get(body, 'output')
  if (!Array.isArray(output)) {
    return ''
  }
  const chunks: string[] = []
  for (const outputItem of output) {
    if (!isObject(outputItem)) {
      continue
    }
    if (Reflect.get(outputItem, 'type') !== 'message') {
      continue
    }
    const content = Reflect.get(outputItem, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!isObject(part)) {
        continue
      }
      const type = Reflect.get(part, 'type')
      const text = Reflect.get(part, 'text')
      if ((type === 'output_text' || type === 'text') && typeof text === 'string' && text) {
        chunks.push(text)
      }
    }
  }
  return chunks.join('')
}

const getBackendResponsesBody = (
  messages: readonly ChatMessage[],
  modelId: string,
  systemPrompt: string,
  tools: readonly unknown[],
  maxToolCalls: number,
  webSearchEnabled: boolean,
  reasoningEffort?: GetAiResponseOptions['reasoningEffort'],
  supportsReasoningEffort = false,
): object => {
  const input = messages.map((message) => ({
    content: getChatMessageOpenAiContent(message),
    role: message.role,
  }))
  return getOpenAiParams(
    input,
    modelId,
    false,
    false,
    tools,
    webSearchEnabled,
    maxToolCalls,
    systemPrompt,
    undefined,
    reasoningEffort,
    supportsReasoningEffort,
  )
}

const getBackendAssistantText = async (
  messages: readonly ChatMessage[],
  modelId: string,
  backendUrl: string,
  authAccessToken: string,
  systemPrompt: string,
  agentMode = defaultAgentMode,
  questionToolEnabled = false,
  toolEnablement?: GetAiResponseOptions['toolEnablement'],
  maxToolCalls = defaultMaxToolCalls,
  webSearchEnabled = false,
  reasoningEffort?: GetAiResponseOptions['reasoningEffort'],
  supportsReasoningEffort = false,
): Promise<string> => {
  const mockError = MockBackendCompletion.takeErrorResponse()
  if (mockError) {
    const errorMessage = getBackendErrorMessageFromBody(mockError.body)
    return getBackendErrorMessage({
      details: 'http-error',
      ...(typeof mockError.statusCode === 'number'
        ? {
            statusCode: mockError.statusCode,
          }
        : {}),
      ...(errorMessage
        ? {
            errorMessage,
          }
        : {}),
    })
  }

  let response: Response
  try {
    const tools = await getBasicChatTools(agentMode, questionToolEnabled, toolEnablement)
    response = await fetch(getBackendResponsesEndpoint(backendUrl), {
      body: JSON.stringify(
        getBackendResponsesBody(
          messages,
          modelId,
          systemPrompt,
          tools,
          maxToolCalls,
          webSearchEnabled,
          reasoningEffort,
          supportsReasoningEffort,
        ),
      ),
      headers: {
        Authorization: `Bearer ${authAccessToken}`,
        'Content-Type': 'application/json',
        ...getClientRequestIdHeader(),
      },
      method: 'POST',
    })
  } catch {
    return getBackendErrorMessage({
      details: 'request-failed',
    })
  }
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => undefined)
    const errorMessage = getBackendErrorMessageFromBody(payload)
    const statusCode = response.status || getBackendStatusCodeFromBody(payload)
    return getBackendErrorMessage({
      details: 'http-error',
      ...(typeof statusCode === 'number'
        ? {
            statusCode,
          }
        : {}),
      ...(errorMessage
        ? {
            errorMessage,
          }
        : {}),
    })
  }
  let json: unknown
  try {
    json = (await response.json()) as unknown
  } catch {
    return backendCompletionFailedMessage
  }
  const content = getBackendResponseOutputText(json)
  return typeof content === 'string' && content ? content : backendCompletionFailedMessage
}

export const getAiResponse = async ({
  agentMode = defaultAgentMode,
  assetDir,
  authAccessToken,
  backendUrl = '',
  maxToolCalls = defaultMaxToolCalls,
  messageId,
  messages,
  mockAiResponseDelay = 800,
  mockApiCommandId,
  models,
  nextMessageId,
  onDataEvent,
  onEventStreamFinished,
  onMockOpenApiRequestCaptured,
  onTextChunk,
  onToolCallsChunk,
  openApiApiBaseUrl,
  openApiApiKey,
  openRouterApiBaseUrl,
  openRouterApiKey,
  passIncludeObfuscation = false,
  platform,
  questionToolEnabled = false,
  reasoningEffort,
  selectedModelId,
  sessionId,
  streamingEnabled = true,
  systemPrompt = '',
  toolEnablement,
  useChatCoordinatorWorker = false,
  useChatNetworkWorkerForRequests = false,
  useChatToolWorker = true,
  useMockApi,
  useOwnBackend = false,
  userText,
  webSearchEnabled = false,
  workspaceUri,
}: GetAiResponseOptions): Promise<ChatMessage> => {
  useChatCoordinatorWorker = false // TODO enable this
  if (useChatCoordinatorWorker && !useOwnBackend) {
    try {
      const result = await ChatCoordinatorRequest.getAiResponse({
        agentMode,
        assetDir,
        ...(messageId
          ? {
              messageId,
            }
          : {}),
        maxToolCalls,
        messages,
        mockAiResponseDelay,
        mockApiCommandId,
        models,
        nextMessageId,
        openApiApiBaseUrl,
        openApiApiKey,
        openRouterApiBaseUrl,
        openRouterApiKey,
        passIncludeObfuscation,
        platform,
        questionToolEnabled,
        ...(reasoningEffort
          ? {
              reasoningEffort,
            }
          : {}),
        selectedModelId,
        streamingEnabled,
        systemPrompt,
        ...(toolEnablement
          ? {
              toolEnablement,
            }
          : {}),
        useChatNetworkWorkerForRequests,
        useChatToolWorker,
        useMockApi,
        userText,
        webSearchEnabled: agentMode === 'plan' ? false : webSearchEnabled,
        ...(workspaceUri
          ? {
              workspaceUri,
            }
          : {}),
      })
      if (streamingEnabled) {
        if (onTextChunk) {
          await onTextChunk(result.text)
        }
        if (onEventStreamFinished) {
          await onEventStreamFinished()
        }
      }
      return result
    } catch {
      // Fall back to the local implementation if coordinator worker RPC is unavailable.
    }
  }

  let text = ''
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  const selectedModel = models.find((model) => model.id === selectedModelId)
  const supportsImages = selectedModel?.supportsImages ?? false
  const supportsReasoningEffort = selectedModel?.supportsReasoningEffort ?? false
  const safeMaxToolCalls = Math.max(1, maxToolCalls)
  if (hasImageAttachments(messages) && !supportsImages) {
    text = getImageNotSupportedMessage(selectedModel?.name)
  }
  if (!text && useOwnBackend) {
    if (!backendUrl) {
      text = backendUrlRequiredMessage
    } else if (authAccessToken) {
      text = await getBackendAssistantText(
        messages,
        getOpenApiModelId(selectedModelId),
        backendUrl,
        authAccessToken,
        systemPrompt,
        agentMode,
        questionToolEnabled,
        toolEnablement,
        safeMaxToolCalls,
        agentMode === 'plan' ? false : webSearchEnabled,
        reasoningEffort,
        supportsReasoningEffort,
      )
    } else {
      text = backendAccessTokenRequiredMessage
    }
  }
  if (!text && usesOpenApiModel) {
    if (useMockApi) {
      const openAiInput: any[] = messages.map((message) => ({
        content: getChatMessageOpenAiContent(message),
        role: message.role,
      }))
      const modelId = getOpenApiModelId(selectedModelId)
      const headers = {
        Authorization: `Bearer ${openApiApiKey}`,
        'Content-Type': 'application/json',
        ...getClientRequestIdHeader(),
      }
      const maxToolIterations = safeMaxToolCalls - 1
      let previousResponseId: string | undefined
      for (let i = 0; i <= maxToolIterations; i++) {
        const tools1 = await getBasicChatTools(agentMode, questionToolEnabled, toolEnablement)
        const request = {
          headers,
          method: 'POST',
          payload: getOpenAiParams(
            openAiInput,
            modelId,
            streamingEnabled,
            passIncludeObfuscation,
            tools1,
            agentMode === 'plan' ? false : webSearchEnabled,
            safeMaxToolCalls,
            systemPrompt,
            previousResponseId,
            reasoningEffort,
            supportsReasoningEffort,
          ),
          url: getOpenApiApiEndpoint(openApiApiBaseUrl),
        }
        MockOpenApiRequest.capture(request)
        if (onMockOpenApiRequestCaptured) {
          await Promise.resolve(onMockOpenApiRequestCaptured(request))
        }
        const result = await getMockOpenApiAssistantText(streamingEnabled, onTextChunk, onToolCallsChunk, onDataEvent, onEventStreamFinished)
        if (result.type !== 'success') {
          text = getOpenApiErrorMessage(result)
          break
        }
        text = result.text
        if (result.responseId) {
          previousResponseId = result.responseId
        }
        if (result.responseFunctionCalls.length === 0) {
          break
        }
        openAiInput.length = 0
        const executedToolCalls: StreamingToolCall[] = []
        for (const toolCall of result.responseFunctionCalls) {
          const content = await executeChatTool(toolCall.name, toolCall.arguments, {
            assetDir,
            platform,
            ...(sessionId
              ? {
                  sessionId,
                }
              : {}),
            toolCallId: toolCall.callId,
            ...(toolEnablement
              ? {
                  toolEnablement,
                }
              : {}),
            useChatToolWorker,
            ...(workspaceUri
              ? {
                  workspaceUri,
                }
              : {}),
          })
          const executionStatus = getToolCallExecutionStatus(content)
          const toolCallResult = getToolCallResult(toolCall.name, content)
          executedToolCalls.push({
            arguments: toolCall.arguments,
            ...(executionStatus.errorStack
              ? {
                  errorStack: executionStatus.errorStack,
                }
              : {}),
            ...(executionStatus.errorMessage
              ? {
                  errorMessage: executionStatus.errorMessage,
                }
              : {}),
            id: toolCall.callId,
            name: toolCall.name,
            ...(toolCallResult
              ? {
                  result: toolCallResult,
                }
              : {}),
            ...(executionStatus.status
              ? {
                  status: executionStatus.status,
                }
              : {}),
          })
          openAiInput.push({
            call_id: toolCall.callId,
            output: content,
            type: 'function_call_output',
          })
        }
        if (onToolCallsChunk && executedToolCalls.length > 0) {
          await onToolCallsChunk(executedToolCalls)
        }
      }
    } else if (openApiApiKey) {
      const result = await getOpenApiAssistantText(
        messages,
        getOpenApiModelId(selectedModelId),
        openApiApiKey,
        openApiApiBaseUrl,
        assetDir,
        platform,
        {
          agentMode,
          includeObfuscation: passIncludeObfuscation,
          maxToolCalls: safeMaxToolCalls,
          ...(onDataEvent
            ? {
                onDataEvent,
              }
            : {}),
          ...(onEventStreamFinished
            ? {
                onEventStreamFinished,
              }
            : {}),
          ...(onTextChunk
            ? {
                onTextChunk,
              }
            : {}),
          ...(onToolCallsChunk
            ? {
                onToolCallsChunk,
              }
            : {}),
          questionToolEnabled,
          ...(reasoningEffort
            ? {
                reasoningEffort,
              }
            : {}),
          ...(sessionId
            ? {
                sessionId,
              }
            : {}),
          stream: streamingEnabled,
          supportsReasoningEffort,
          systemPrompt,
          ...(toolEnablement
            ? {
                toolEnablement,
              }
            : {}),
          useChatNetworkWorkerForRequests,
          useChatToolWorker,
          webSearchEnabled: agentMode === 'plan' ? false : webSearchEnabled,
          ...(workspaceUri
            ? {
                workspaceUri,
              }
            : {}),
        },
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenApiErrorMessage(result)
      }
    } else {
      text = openApiApiKeyRequiredMessage
    }
  } else if (!text && usesOpenRouterModel) {
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
      const result = await getOpenRouterAssistantText(
        messages,
        modelId,
        openRouterApiKey,
        openRouterApiBaseUrl,
        assetDir,
        platform,
        useChatNetworkWorkerForRequests,
        useChatToolWorker,
        questionToolEnabled,
        systemPrompt,
        workspaceUri,
        agentMode,
        toolEnablement,
        sessionId,
      )
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
    text = await getMockAiResponse(userText, mockAiResponseDelay)
  }
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const message: ChatMessage = {
    id: messageId || crypto.randomUUID(),
    role: 'assistant',
    text,
    time: assistantTime,
  }
  return message
}
