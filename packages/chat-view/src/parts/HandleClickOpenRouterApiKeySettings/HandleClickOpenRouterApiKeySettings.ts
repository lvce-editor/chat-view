import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickOpenRouterApiKeySettings = async (state: ChatState): Promise<ChatState> => {
  await RendererWorker.openExternal(state.openRouterApiKeysSettingsUrl)
  return state
}
