import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openApiRequestFailedMessage, openApiRequestFailedOfflineMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'

const isRetriableOpenApiErrorMessage = (text: string): boolean => {
  return text === openApiRequestFailedMessage || text === openApiRequestFailedOfflineMessage
}

export const handleClickRetryOpenApiRequest = async (state: ChatState): Promise<ChatState> => {
  const session = state.sessions.find((item) => item.id === state.selectedSessionId)
  if (!session) {
    return state
  }

  const lastMessage = session.messages.at(-1)
  if (lastMessage?.role !== 'assistant' || !isRetriableOpenApiErrorMessage(lastMessage.text)) {
    return state
  }

  const previousUserMessage = session.messages.toReversed().find((item) => item.role === 'user')
  if (!previousUserMessage) {
    return state
  }

  const retryMessages = session.messages.slice(0, -1)
  const assistantMessage = await getAiResponse({
    assetDir: state.assetDir,
    messages: retryMessages,
    mockAiResponseDelay: state.mockAiResponseDelay,
    mockApiCommandId: state.mockApiCommandId,
    models: state.models,
    nextMessageId: state.nextMessageId,
    openApiApiBaseUrl: state.openApiApiBaseUrl,
    openApiApiKey: state.openApiApiKey,
    openRouterApiBaseUrl: state.openRouterApiBaseUrl,
    openRouterApiKey: state.openRouterApiKey,
    passIncludeObfuscation: state.passIncludeObfuscation,
    platform: state.platform,
    selectedModelId: state.selectedModelId,
    streamingEnabled: state.streamingEnabled,
    useMockApi: state.useMockApi,
    userText: previousUserMessage.text,
    webSearchEnabled: state.webSearchEnabled,
  })

  const updatedSession = {
    ...session,
    messages: [...session.messages.slice(0, -1), assistantMessage],
  }

  await saveChatSession(updatedSession)

  const updatedSessions = state.sessions.map((item) => {
    if (item.id !== state.selectedSessionId) {
      return item
    }
    return updatedSession
  })

  return {
    ...state,
    nextMessageId: state.nextMessageId + 1,
    sessions: updatedSessions,
  }
}
