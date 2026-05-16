import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { openApiApiKeyRequiredMessage } from '../ChatStrings/ChatStrings.ts'
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
  const selectedMessages = updatedState.messages.length > 0 ? updatedState.messages : session.messages

  const lastMessage = selectedMessages.at(-1)
  const shouldRetryOpenApi = lastMessage?.role === 'assistant' && lastMessage.text === openApiApiKeyRequiredMessage

  if (!shouldRetryOpenApi) {
    return updatedState
  }

  const previousUserMessage = selectedMessages.toReversed().find((item) => item.role === 'user')
  if (!previousUserMessage) {
    return updatedState
  }

  const retryMessages = selectedMessages.slice(0, -1)

  // TODO ask view-model to do it
  return state
}
