import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export interface ChatListTargetNone {
  readonly type: 'none'
}

export interface ChatListTargetSession {
  readonly listIndex: number
  readonly session: ChatSession
  readonly sessionIndex: number
  readonly type: 'session'
}

export interface ChatListTargetToggle {
  readonly listIndex: number
  readonly type: 'toggle'
}

export type ChatListTarget = ChatListTargetNone | ChatListTargetSession | ChatListTargetToggle

const none: ChatListTargetNone = {
  type: 'none',
}

const getSessionIndexFromListIndex = (listIndex: number, sessionCount: number, expanded: boolean): number => {
  if (listIndex < 0) {
    return -1
  }
  if (sessionCount <= 3) {
    return listIndex < sessionCount ? listIndex : -1
  }
  if (listIndex < 3) {
    return listIndex
  }
  if (listIndex === 3) {
    return -2
  }
  if (!expanded) {
    return -1
  }
  const sessionIndex = listIndex - 1
  return sessionIndex < sessionCount ? sessionIndex : -1
}

export const getChatListTarget = (state: ChatState, eventX: number, eventY: number): ChatListTarget => {
  const listIndex = getListIndex(state, eventX, eventY)
  if (listIndex === -1) {
    return none
  }
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  const sessionIndex = getSessionIndexFromListIndex(listIndex, visibleSessions.length, state.chatListExpanded)
  if (sessionIndex === -2) {
    return {
      listIndex,
      type: 'toggle',
    }
  }
  if (sessionIndex === -1) {
    return none
  }
  const session = visibleSessions[sessionIndex]
  if (!session) {
    return none
  }
  return {
    listIndex,
    session,
    sessionIndex,
    type: 'session',
  }
}