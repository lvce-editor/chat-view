import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const handleClickSaveOpenRouterApiKey = async (state: ChatState): Promise<ChatState> => {
  const { models, nextMessageId, openRouterApiBaseUrl, openRouterApiKeyInput, selectedModelId, selectedSessionId, sessions } = state
  const openRouterApiKey = openRouterApiKeyInput.trim()
  if (!openRouterApiKey) {
    return state
  }
  await Preferences.update({
    'secrets.openRouterApiKey': openRouterApiKey,
  })

  const session = sessions.find((item) => item.id === selectedSessionId)
  if (!session) {
    return {
      ...state,
      openRouterApiKey,
    }
  }

  const lastMessage = session.messages.at(-1)
  const shouldRetryOpenRouter = lastMessage?.role === 'assistant' && lastMessage.text === openRouterApiKeyRequiredMessage

  if (!shouldRetryOpenRouter) {
    return {
      ...state,
      openRouterApiKey,
    }
  }

  const previousUserMessage = session.messages.toReversed().find((item) => item.role === 'user')
  if (!previousUserMessage) {
    return {
      ...state,
      openRouterApiKey,
    }
  }

  const assistantMessage = await getAiResponse(
    previousUserMessage.text,
    nextMessageId,
    selectedModelId,
    models,
    openRouterApiKey,
    openRouterApiBaseUrl,
  )

  const updatedSession = {
    ...session,
    messages: [...session.messages.slice(0, -1), assistantMessage],
  }

  await saveChatSession(updatedSession)

  const updatedSessions = sessions.map((item) => {
    if (item.id !== selectedSessionId) {
      return item
    }
    return updatedSession
  })

  return {
    ...state,
    nextMessageId: nextMessageId + 1,
    openRouterApiKey,
    sessions: updatedSessions,
  }
}
