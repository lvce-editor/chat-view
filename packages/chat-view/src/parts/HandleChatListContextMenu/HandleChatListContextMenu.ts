import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { MenuChatList } from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const handleChatListContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { selectedProjectId, sessions, uid } = state
  const index = getListIndex(state, eventX, eventY)
  if (index === -1) {
    return state
  }
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId, state.searchValue)
  const item = visibleSessions[index]
  if (!item) {
    return state
  }
  await RendererWorker.showContextMenu2(uid, MenuChatList, eventX, eventY, {
    menuId: MenuChatList,
    sessionId: item.id,
  })
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: index,
    listFocusOutline: true,
    listSelectedSessionId: item.id,
  }
}
