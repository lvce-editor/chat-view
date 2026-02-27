import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const createDefaultState = (): ChatState => {
  const defaultSessionId = 'session-1'
  return {
    assetDir: '',
    composerValue: '',
    errorCount: 0,
    focus: 'composer',
    focused: false,
    height: 0,
    initial: true,
    inputSource: 'script',
    lastSubmittedSessionId: '',
    listItemHeight: 40,
    nextMessageId: 1,
    platform: 0,
    renamingSessionId: '',
    selectedSessionId: defaultSessionId,
    sessions: [
      {
        id: defaultSessionId,
        messages: [],
        title: Strings.defaultSessionTitle,
      },
    ],
    uid: 0,
    viewMode: 'list',
    warningCount: 0,
    width: 0,
    x: 0,
    y: 0,
  }
}
