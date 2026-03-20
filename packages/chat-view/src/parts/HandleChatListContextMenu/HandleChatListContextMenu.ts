import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const handleChatListContextMenu = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { selectedProjectId, sessions, uid } = state
  const index = getListIndex(state, eventX, eventY)
  if (index === -1) {
    return state
  }
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId)
  const item = visibleSessions[index]
  if (!item) {
    return state
  }
  await RendererWorker.showContextMenu2(uid, -1, eventX, eventY, {
    menuId: -1,
    sessionId: item.id,
  })
  return state
}
