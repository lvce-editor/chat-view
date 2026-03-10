import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickOpenApiApiKeyWebsite = async (state: ChatState): Promise<ChatState> => {
  await RendererWorker.openExternal(state.openApiApiKeysSettingsUrl)
  return state
}
