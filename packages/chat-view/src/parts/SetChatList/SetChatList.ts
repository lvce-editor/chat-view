import type { ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'

const dummySessions: readonly ChatSession[] = [
  {
    id: 'session-a',
    messages: [],
    title: 'Dummy Chat A',
  },
  {
    id: 'session-b',
    messages: [],
    title: 'Dummy Chat B',
  },
  {
    id: 'session-c',
    messages: [],
    title: 'Dummy Chat C',
  },
]

export const setChatList = (state: ChatState): ChatState => {
  return {
    ...state,
    nextSessionId: dummySessions.length + 1,
    selectedSessionId: dummySessions[0].id,
    sessions: dummySessions,
  }
}
