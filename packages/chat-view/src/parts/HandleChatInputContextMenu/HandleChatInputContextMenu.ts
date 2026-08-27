import type { ChatState } from '../ChatState/ChatState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import { MenuChatInput } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleChatInputContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { uid } = state
  await ContextMenu.show2(uid, MenuChatInput, eventX, eventY, {
    menuId: MenuChatInput,
  })
  return state
}
