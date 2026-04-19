import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetAiResponseOptions } from '../GetAiResponseOptions/GetAiResponseOptions.ts'
import type { GetAiResponseRequestOptions } from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'

export const getAiResponse = async (options: Readonly<GetAiResponseOptions>): Promise<ChatMessage> => {
  const requestOptions: GetAiResponseRequestOptions = {
    assetDir: options.assetDir,
    messages: options.messages,
    mockApiCommandId: options.mockApiCommandId,
    models: options.models,
    nextMessageId: options.nextMessageId,
    openApiApiBaseUrl: options.openApiApiBaseUrl,
    openApiApiKey: options.openApiApiKey,
    openRouterApiBaseUrl: options.openRouterApiBaseUrl,
    openRouterApiKey: options.openRouterApiKey,
    platform: options.platform,
    selectedModelId: options.selectedModelId,
    useMockApi: options.useMockApi,
    userText: options.userText,
  }
  if (options.agentMode) {
    requestOptions.agentMode = options.agentMode
  }
  if (typeof options.maxToolCalls === 'number') {
    requestOptions.maxToolCalls = options.maxToolCalls
  }
  if (options.messageId) {
    requestOptions.messageId = options.messageId
  }
  if (typeof options.mockAiResponseDelay === 'number') {
    requestOptions.mockAiResponseDelay = options.mockAiResponseDelay
  }
  if (options.passIncludeObfuscation === true) {
    requestOptions.passIncludeObfuscation = true
  }
  if (options.questionToolEnabled === true) {
    requestOptions.questionToolEnabled = true
  }
  if (options.reasoningEffort) {
    requestOptions.reasoningEffort = options.reasoningEffort
  }
  if (options.streamingEnabled === true) {
    requestOptions.streamingEnabled = true
  }
  if (options.systemPrompt) {
    requestOptions.systemPrompt = options.systemPrompt
  }
  if (options.toolEnablement) {
    requestOptions.toolEnablement = options.toolEnablement
  }
  if (options.useChatNetworkWorkerForRequests === true) {
    requestOptions.useChatNetworkWorkerForRequests = true
  }
  if (options.useChatToolWorker === true) {
    requestOptions.useChatToolWorker = true
  }
  if (options.webSearchEnabled === true) {
    requestOptions.webSearchEnabled = true
  }
  if (options.workspaceUri) {
    requestOptions.workspaceUri = options.workspaceUri
  }
  const result = await ChatCoordinatorRequest.getAiResponse(requestOptions)
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
