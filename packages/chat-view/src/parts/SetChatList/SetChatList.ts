import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'

const dummySessions: readonly ChatSession[] = [
  {
    id: 'session-a',
    messages: [],
    title: Strings.dummyChatA(),
  },
  {
    id: 'session-b',
    messages: [],
    title: Strings.dummyChatB(),
  },
  {
    id: 'session-c',
    messages: [],
    title: Strings.dummyChatC(),
  },
]

export const setChatList = (state: ChatState): ChatState => {
  return {
    ...state,
    searchEnabled: true,
    searchFieldVisible: false,
    searchValue: '',
    selectedSessionId: dummySessions[0].id,
    sessions: dummySessions,
    viewMode: 'list',
  }
}
