import type { ChatState } from '../ChatState/ChatState.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const createDefaultState = (): ChatState => {
  const defaultSessionId = 'session-1'
  const defaultModelId = 'test'
  return {
    assetDir: '',
    composerValue: '',
    errorCount: 0,
    focus: 'composer',
    focused: false,
    headerHeight: 50,
    height: 0,
    initial: true,
    inputSource: 'script',
    lastSubmittedSessionId: '',
    listItemHeight: 40,
    models: [
      { id: defaultModelId, name: 'Test' },
      { id: 'codex-5.3', name: 'Codex 5.3' },
      { id: 'claude-code', name: 'Claude Code' },
      { id: 'claude-haiku', name: 'Claude Haiku' },
    ],
    nextMessageId: 1,
    platform: 0,
    renamingSessionId: '',
    selectedModelId: defaultModelId,
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
