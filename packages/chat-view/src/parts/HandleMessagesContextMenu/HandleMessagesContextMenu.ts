import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleMessagesContextMenu = async (state: ChatState): Promise<ChatState> => {
  await RendererWorker.invoke('ContextMenu.show', 1234)
  return state
}