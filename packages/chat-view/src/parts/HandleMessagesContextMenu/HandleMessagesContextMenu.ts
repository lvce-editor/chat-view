import type { ChatState } from '../ChatState/ChatState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import { MenuChatInput } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleMessagesContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await ContextMenu.show2(uid, MenuChatInput, x, y, {
    menuId: MenuChatInput,
  })
  return state
}
