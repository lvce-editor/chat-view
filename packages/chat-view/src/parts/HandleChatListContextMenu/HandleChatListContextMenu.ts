import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatListTarget } from '../GetChatListTarget/GetChatListTarget.ts'
import { MenuChatList, MenuChatListToggle } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleChatListContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { uid } = state
  const target = getChatListTarget(state, eventX, eventY)
  if (target.type === 'none') {
    return state
  }
  if (target.type === 'toggle') {
    await RendererWorker.showContextMenu2(uid, MenuChatListToggle, eventX, eventY, {
      menuId: MenuChatListToggle,
    })
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  await RendererWorker.showContextMenu2(uid, MenuChatList, eventX, eventY, {
    menuId: MenuChatList,
    sessionId: target.session.id,
  })
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: target.sessionIndex,
    listFocusOutline: true,
  }
}
