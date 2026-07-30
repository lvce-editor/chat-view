import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatMessages } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleMessagesContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await RendererWorker.showContextMenu2(uid, MenuChatMessages, x, y, {
    menuId: MenuChatMessages,
  })
  return state
}
