import type { ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'
<<<<<<< HEAD
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
=======
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
>>>>>>> origin/main

const dummySessions: readonly ChatSession[] = [
  {
    id: 'session-a',
    messages: [],
    title: Strings.dummyChatA,
  },
  {
    id: 'session-b',
    messages: [],
    title: Strings.dummyChatB,
  },
  {
    id: 'session-c',
    messages: [],
    title: Strings.dummyChatC,
  },
]

export const setChatList = (state: ChatState): ChatState => {
  return {
    ...state,
    selectedSessionId: dummySessions[0].id,
    sessions: dummySessions,
    viewMode: 'detail',
  }
}
