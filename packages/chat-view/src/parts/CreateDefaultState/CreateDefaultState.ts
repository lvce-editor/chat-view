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
      { id: defaultModelId, name: 'test', provider: 'test' },
      { id: 'codex-5.3', name: 'Codex 5.3', provider: 'openRouter' },
      { id: 'claude-code', name: 'Claude Code', provider: 'openRouter' },
      { id: 'claude-haiku', name: 'Claude Haiku', provider: 'openRouter' },
      { id: 'openRouter/openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openRouter' },
      { id: 'openRouter/anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'openRouter' },
      { id: 'openRouter/google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'openRouter' },
    ],
    nextMessageId: 1,
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
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
    tokensMax: 0,
    tokensUsed: 0,
    uid: 0,
    usageOverviewEnabled: false,
    viewMode: 'list',
    warningCount: 0,
    width: 0,
    x: 0,
    y: 0,
  }
}
