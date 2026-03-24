import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openApiApiKeyRequiredMessage } from '../ChatStrings/ChatStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { setOpenApiApiKey } from '../SetOpenApiApiKey/SetOpenApiApiKey.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const handleClickSaveOpenApiApiKey = async (state: ChatState): Promise<ChatState> => {
  const { openApiApiKeyInput } = state
  const openApiApiKey = openApiApiKeyInput.trim()
  if (!openApiApiKey) {
    return state
  }
  const optimisticState = {
    ...state,
    openApiApiKeyState: 'saving' as const,
  }
  set(state.uid, state, optimisticState)
  await RendererWorker.invoke('Chat.rerender')

  const persistedState = await setOpenApiApiKey(optimisticState, openApiApiKey)
  const updatedState = {
    ...persistedState,
    openApiApiKeyState: 'idle' as const,
  }

  const session = updatedState.sessions.find((item) => item.id === updatedState.selectedSessionId)
  if (!session) {
    return updatedState
  }

  const lastMessage = session.messages.at(-1)
  const shouldRetryOpenApi = lastMessage?.role === 'assistant' && lastMessage.text === openApiApiKeyRequiredMessage

  if (!shouldRetryOpenApi) {
    return updatedState
  }

  const previousUserMessage = session.messages.toReversed().find((item) => item.role === 'user')
  if (!previousUserMessage) {
    return updatedState
  }

  const retryMessages = session.messages.slice(0, -1)

  const assistantMessage = await getAiResponse({
    assetDir: updatedState.assetDir,
    maxToolCalls: updatedState.maxToolCalls,
    messages: retryMessages,
    mockAiResponseDelay: updatedState.mockAiResponseDelay,
    mockApiCommandId: updatedState.mockApiCommandId,
    models: updatedState.models,
    nextMessageId: updatedState.nextMessageId,
    openApiApiBaseUrl: updatedState.openApiApiBaseUrl,
    openApiApiKey: updatedState.openApiApiKey,
    openRouterApiBaseUrl: updatedState.openRouterApiBaseUrl,
    openRouterApiKey: updatedState.openRouterApiKey,
    platform: updatedState.platform,
    selectedModelId: updatedState.selectedModelId,
    streamingEnabled: updatedState.streamingEnabled,
    systemPrompt: updatedState.systemPrompt,
    useChatCoordinatorWorker: updatedState.useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests: updatedState.useChatNetworkWorkerForRequests,
    useMockApi: updatedState.useMockApi,
    userText: previousUserMessage.text,
  })

  const updatedSession = {
    ...session,
    messages: [...session.messages.slice(0, -1), assistantMessage],
  }

  await saveChatSession(updatedSession)

  const updatedSessions = updatedState.sessions.map((item) => {
    if (item.id !== updatedState.selectedSessionId) {
      return item
    }
    return updatedSession
  })

  return {
    ...updatedState,
    nextMessageId: updatedState.nextMessageId + 1,
    openApiApiKeyState: 'idle',
    sessions: updatedSessions,
  }
}
