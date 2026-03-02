import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { setOpenRouterApiKey } from '../SetOpenRouterApiKey/SetOpenRouterApiKey.ts'

export const handleClickSaveOpenRouterApiKey = async (state: ChatState): Promise<ChatState> => {
  const { openRouterApiKeyInput } = state
  const openRouterApiKey = openRouterApiKeyInput.trim()
  if (!openRouterApiKey) {
    return state
  }
  const updatedState = await setOpenRouterApiKey(state, openRouterApiKey)

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

  const assistantMessage = await getAiResponse(
    previousUserMessage.text,
    retryMessages,
    updatedState.nextMessageId,
    updatedState.selectedModelId,
    updatedState.models,
    openRouterApiKey,
    updatedState.openRouterApiBaseUrl,
  )

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
    sessions: updatedSessions,
  }
}
