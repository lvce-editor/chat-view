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
import * as MockOpenApiRequest from '../MockOpenApiRequest/MockOpenApiRequest.ts'

const trailingSlashesRegex = /\/+$/

const getBackendCompletionsEndpoint = (backendUrl: string): string => {
  const trimmedBackendUrl = backendUrl.replace(trailingSlashesRegex, '')
  return `${trimmedBackendUrl}/v1/chat/completions`
}

const getEffectiveBackendModelId = (selectedModelId: string): string => {
  const separatorIndex = selectedModelId.indexOf('/')
  if (separatorIndex === -1) {
    return selectedModelId
  }
  return selectedModelId.slice(separatorIndex + 1)
}

const hasImageAttachments = (messages: readonly ChatMessage[]): boolean => {
  return messages.some((message) => message.attachments?.some((attachment) => attachment.displayType === 'image'))
}

const getBackendAssistantText = async (
  messages: readonly ChatMessage[],
  selectedModelId: string,
  backendUrl: string,
  authAccessToken: string,
  systemPrompt: string,
): Promise<string> => {
  let response: Response
  try {
    response = await fetch(getBackendCompletionsEndpoint(backendUrl), {
      body: JSON.stringify({
        messages: [
          ...(systemPrompt
            ? [
                {
                  content: systemPrompt,
                  role: 'system',
                },
              ]
            : []),
          ...messages.map((message) => ({
            content: message.text,
            role: message.role,
          })),
        ],
        model: getEffectiveBackendModelId(selectedModelId),
        stream: false,
      }),
      headers: {
        Authorization: `Bearer ${authAccessToken}`,
        'Content-Type': 'application/json',
        ...getClientRequestIdHeader(),
      },
      method: 'POST',
    })
  } catch {
    return backendCompletionFailedMessage
  }
  if (!response.ok) {
    return backendCompletionFailedMessage
  }
  const json = (await response.json()) as {
    readonly choices?: readonly {
      readonly message?: {
        readonly content?: string
      }
    }[]
  }
  const content = json.choices?.[0]?.message?.content
  return typeof content === 'string' && content ? content : backendCompletionFailedMessage
}

export const getAiResponse = async ({
  agentMode = defaultAgentMode,
  assetDir,
  authAccessToken,
  authEnabled = false,
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
  userText,
  webSearchEnabled = false,
  workspaceUri,
}: GetAiResponseOptions): Promise<ChatMessage> => {
  useChatCoordinatorWorker = false // TODO enable this
  if (useChatCoordinatorWorker && !authEnabled) {
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
  if (hasImageAttachments(messages) && !supportsImages) {
    text = getImageNotSupportedMessage(selectedModel?.name)
  }
  if (!text && authEnabled) {
    if (!backendUrl) {
      text = backendUrlRequiredMessage
    } else if (authAccessToken) {
      text = await getBackendAssistantText(messages, selectedModelId, backendUrl, authAccessToken, systemPrompt)
    } else {
      text = backendAccessTokenRequiredMessage
    }
  }
  if (!text && usesOpenApiModel) {
    const safeMaxToolCalls = Math.max(1, maxToolCalls)
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
        const request = {
          headers,
          method: 'POST',
          payload: getOpenAiParams(
            openAiInput,
            modelId,
            streamingEnabled,
            passIncludeObfuscation,
            await getBasicChatTools(agentMode, questionToolEnabled, toolEnablement),
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
