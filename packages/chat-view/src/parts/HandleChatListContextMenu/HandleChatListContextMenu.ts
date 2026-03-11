import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'

const CHAT_LIST_ITEM_CONTEXT_MENU = 'ChatListItemContextMenu'

export const handleChatListContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const index = getListIndex(state, eventX, eventY)
  if (index === -1) {
    return state
  }
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  const item = visibleSessions[index]
  if (!item) {
    return state
  }
  await RendererWorker.invoke('ContextMenu.show', eventX, eventY, CHAT_LIST_ITEM_CONTEXT_MENU, item.id)
  return state
}
