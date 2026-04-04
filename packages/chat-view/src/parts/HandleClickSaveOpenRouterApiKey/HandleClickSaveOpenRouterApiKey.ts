import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openRouterApiKeyRequiredMessage } from '../ChatStrings/ChatStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { setOpenRouterApiKey } from '../SetOpenRouterApiKey/SetOpenRouterApiKey.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const handleClickSaveOpenRouterApiKey = async (state: ChatState): Promise<ChatState> => {
  const { openRouterApiKeyInput } = state
  const openRouterApiKey = openRouterApiKeyInput.trim()
  if (!openRouterApiKey) {
    return state
  }
  const optimisticState = {
    ...state,
    openRouterApiKeyState: 'saving' as const,
  }
  set(state.uid, state, optimisticState)
  await RendererWorker.invoke('Chat.rerender')

  const persistedState = await setOpenRouterApiKey(optimisticState, openRouterApiKey)
  const updatedState = {
    ...persistedState,
    openRouterApiKeyState: 'idle' as const,
  }

  const session = updatedState.sessions.find((item) => item.id === updatedState.selectedSessionId)
  if (!session) {
    return updatedState
  }

  const lastMessage = session.messages.at(-1)
  const shouldRetryOpenRouter = lastMessage?.role === 'assistant' && lastMessage.text === openRouterApiKeyRequiredMessage

  if (!shouldRetryOpenRouter) {
    return updatedState
  }

  const previousUserMessage = session.messages.toReversed().find((item) => item.role === 'user')
  if (!previousUserMessage) {
    return updatedState
  }

  const retryMessages = session.messages.slice(0, -1)

  const assistantMessage = await getAiResponse({
    agentMode: updatedState.agentMode,
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
    openRouterApiKey,
    platform: updatedState.platform,
    selectedModelId: updatedState.selectedModelId,
    systemPrompt: updatedState.systemPrompt,
    useChatCoordinatorWorker: updatedState.useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests: updatedState.useChatNetworkWorkerForRequests,
    useOwnBackend: updatedState.useOwnBackend,
    useMockApi: updatedState.useMockApi,
    userText: previousUserMessage.text,
  })

  const parsedMessages = await parseAndStoreMessageContent(updatedState.parsedMessages, assistantMessage)

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
    openRouterApiKeyState: 'idle',
    parsedMessages,
    sessions: updatedSessions,
  }
}
