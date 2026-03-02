import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openApiApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { setOpenApiApiKey } from '../SetOpenApiApiKey/SetOpenApiApiKey.ts'

export const handleClickSaveOpenApiApiKey = async (state: ChatState): Promise<ChatState> => {
  const { openApiApiKeyInput } = state
  const openApiApiKey = openApiApiKeyInput.trim()
  if (!openApiApiKey) {
    return state
  }
  const updatedState = await setOpenApiApiKey(state, openApiApiKey)

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

  const assistantMessage = await getAiResponse(
    previousUserMessage.text,
    retryMessages,
    updatedState.nextMessageId,
    updatedState.selectedModelId,
    updatedState.models,
    updatedState.openApiApiKey,
    updatedState.openApiApiBaseUrl,
    updatedState.openRouterApiKey,
    updatedState.openRouterApiBaseUrl,
    updatedState.useMockApi,
    updatedState.mockApiCommandId,
    updatedState.assetDir,
    updatedState.platform,
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
