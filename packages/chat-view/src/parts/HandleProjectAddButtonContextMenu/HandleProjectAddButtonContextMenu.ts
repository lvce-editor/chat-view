import type { ChatState } from '../ChatState/ChatState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import { MenuProjectAddButton } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleProjectAddButtonContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await ContextMenu.show2(uid, MenuProjectAddButton, x, y, {
    menuId: MenuProjectAddButton,
  })
  return state
}
