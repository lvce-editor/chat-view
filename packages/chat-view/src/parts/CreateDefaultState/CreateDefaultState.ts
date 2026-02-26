import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  const defaultSessionId = 'session-1'
  return {
    assetDir: '',
    composerValue: '',
    errorCount: 0,
    ignoreNextInput: false,
    initial: true,
    lastSubmittedSessionId: '',
    nextMessageId: 1,
    nextSessionId: 2,
    platform: 0,
    renamingSessionId: '',
    selectedSessionId: defaultSessionId,
    sessions: [
      {
        id: defaultSessionId,
        messages: [],
        title: 'Chat 1',
      },
    ],
    uid: 0,
    warningCount: 0,
  }
}
