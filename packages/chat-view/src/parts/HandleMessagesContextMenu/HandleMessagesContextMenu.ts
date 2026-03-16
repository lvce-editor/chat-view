import { MenuEntryId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleMessagesContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  await RendererWorker.showContextMenu2(uid, MenuEntryId.Chat, x, y, {
    menuId: MenuEntryId.Chat,
  })
  return state
}
