import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const createDefaultState = (): ChatState => {
  const defaultSessionId = 'session-1'
  return {
    assetDir: '',
    composerValue: '',
    errorCount: 0,
    ignoreNextInput: false,
    initial: true,
    lastSubmittedSessionId: '',
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
  }
}
