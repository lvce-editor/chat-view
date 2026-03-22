import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatInput } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleChatInputContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { uid } = state
  await RendererWorker.showContextMenu2(uid, MenuChatInput, eventX, eventY, {
    menuId: MenuChatInput,
  })
  return state
}
