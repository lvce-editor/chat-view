import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openApiApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getParsedMessagesForSession } from '../ComputeParsedMessages/ComputeParsedMessages.ts'
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

  const assistantMessage = await getAiResponse({
    assetDir: updatedState.assetDir,
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
    parsedMessages: await getParsedMessagesForSession(updatedSessions, updatedState.selectedSessionId, updatedState.useChatMathWorker),
    sessions: updatedSessions,
  }
}
