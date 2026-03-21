import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuProjectAddButton } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleProjectAddButtonContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await RendererWorker.showContextMenu2(uid, MenuProjectAddButton, x, y, {
    menuId: MenuProjectAddButton,
  })
  return state
}
