import type { ChatState } from '../ChatState/ChatState.ts'
import { handleClickSaveOpenApiApiKey } from '../HandleClickSaveOpenApiApiKey/HandleClickSaveOpenApiApiKey.ts'
import { handleClickSaveOpenRouterApiKey } from '../HandleClickSaveOpenRouterApiKey/HandleClickSaveOpenRouterApiKey.ts'

export const handleMissingOpenAiApiKeyFormSubmit = async (state: ChatState): Promise<ChatState> => {
  return handleClickSaveOpenApiApiKey(state)
}

export const handleMissingOpenRouterApiKeyFormSubmit = async (state: ChatState): Promise<ChatState> => {
  return handleClickSaveOpenRouterApiKey(state)
}
