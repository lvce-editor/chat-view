import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickSaveOpenRouterApiKey = async (state: ChatState): Promise<ChatState> => {
  const { openRouterApiKeyInput } = state
  // TODO ask worker to do it
  // @ts-ignore
  const openRouterApiKey = openRouterApiKeyInput.trim()
  return state
}
