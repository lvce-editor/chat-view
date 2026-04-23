import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatInput } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleMessagesContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await RendererWorker.showContextMenu2(uid, MenuChatInput, x, y, {
    menuId: MenuChatInput,
  })
  return state
}
