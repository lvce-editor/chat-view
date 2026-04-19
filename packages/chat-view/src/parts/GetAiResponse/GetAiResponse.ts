import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetAiResponseOptions } from '../GetAiResponseOptions/GetAiResponseOptions.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'

export const getAiResponse = async (options: Readonly<GetAiResponseOptions>): Promise<ChatMessage> => {
  const result = await ChatCoordinatorRequest.getAiResponse({
    ...(options.agentMode !== undefined
      ? {
          agentMode: options.agentMode,
        }
      : {}),
    assetDir: options.assetDir,
    ...(options.maxToolCalls !== undefined
      ? {
          maxToolCalls: options.maxToolCalls,
        }
      : {}),
    ...(options.messageId !== undefined
      ? {
          messageId: options.messageId,
        }
      : {}),
    messages: options.messages,
    ...(options.mockAiResponseDelay !== undefined
      ? {
          mockAiResponseDelay: options.mockAiResponseDelay,
        }
      : {}),
    mockApiCommandId: options.mockApiCommandId,
    models: options.models,
    nextMessageId: options.nextMessageId,
    openApiApiBaseUrl: options.openApiApiBaseUrl,
    openApiApiKey: options.openApiApiKey,
    openRouterApiBaseUrl: options.openRouterApiBaseUrl,
    openRouterApiKey: options.openRouterApiKey,
    ...(options.passIncludeObfuscation !== undefined
      ? {
          passIncludeObfuscation: options.passIncludeObfuscation,
        }
      : {}),
    platform: options.platform,
    ...(options.questionToolEnabled !== undefined
      ? {
          questionToolEnabled: options.questionToolEnabled,
        }
      : {}),
    ...(options.reasoningEffort !== undefined
      ? {
          reasoningEffort: options.reasoningEffort,
        }
      : {}),
    selectedModelId: options.selectedModelId,
    ...(options.streamingEnabled !== undefined
      ? {
          streamingEnabled: options.streamingEnabled,
        }
      : {}),
    ...(options.systemPrompt !== undefined
      ? {
          systemPrompt: options.systemPrompt,
        }
      : {}),
    ...(options.toolEnablement !== undefined
      ? {
          toolEnablement: options.toolEnablement,
        }
      : {}),
    ...(options.useChatNetworkWorkerForRequests !== undefined
      ? {
          useChatNetworkWorkerForRequests: options.useChatNetworkWorkerForRequests,
        }
      : {}),
    ...(options.useChatToolWorker !== undefined
      ? {
          useChatToolWorker: options.useChatToolWorker,
        }
      : {}),
    useMockApi: options.useMockApi,
    userText: options.userText,
    ...(options.webSearchEnabled !== undefined
      ? {
          webSearchEnabled: options.webSearchEnabled,
        }
      : {}),
    ...(options.workspaceUri !== undefined
      ? {
          workspaceUri: options.workspaceUri,
        }
      : {}),
  })
  if (options.streamingEnabled) {
    if (options.onTextChunk) {
      await options.onTextChunk(result.text)
    }
    if (options.onEventStreamFinished) {
      await options.onEventStreamFinished()
    }
  }
  console.warn('ChatCoordinator.getAiResponse completed')
  return result
}
