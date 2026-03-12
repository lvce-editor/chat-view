import type { ChatState } from '../ChatState/ChatState.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getDefaultModels } from '../GetDefaultModels/GetDefaultModels.ts'

export const createDefaultState = (): ChatState => {
  const defaultProjectId = 'project-1'
  const defaultSessionId = 'session-1'
  const defaultModelId = 'test'
  const chatMessageFontSize = 13
  const chatMessageLineHeight = 20
  const composerFontSize = 13
  const composerLineHeight = 20
  return {
    aiSessionTitleGenerationEnabled: false,
    assetDir: '',
    chatListScrollTop: 0,
    chatMessageFontFamily: 'system-ui',
    chatMessageFontSize,
    chatMessageLineHeight,
    composerDropActive: false,
    composerDropEnabled: true,
    composerFontFamily: 'system-ui',
    composerFontSize,
    composerHeight: composerLineHeight + 8,
    composerLineHeight,
    composerValue: '',
    emitStreamingFunctionCallEvents: false,
    errorCount: 0,
    focus: 'composer',
    focused: false,
    headerHeight: 50,
    height: 0,
    initial: true,
    inputSource: 'script',
    lastSubmittedSessionId: '',
    lastNormalViewMode: 'list',
    listItemHeight: 40,
    maxComposerRows: 5,
    messagesScrollTop: 0,
    mockAiResponseDelay: 800,
    mockApiCommandId: '',
    models: getDefaultModels(),
    nextMessageId: 1,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openApiApiKeyInput: '',
    openApiApiKeysSettingsUrl: 'https://platform.openai.com/api-keys',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    openRouterApiKeyInput: '',
    openRouterApiKeysSettingsUrl: 'https://openrouter.ai/settings/keys',
    openRouterApiKeyState: 'idle',
    passIncludeObfuscation: false,
    platform: 0,
    projectExpandedIds: [defaultProjectId],
    projectListScrollTop: 0,
    projects: [
      {
        id: defaultProjectId,
        name: '_blank',
        uri: '',
      },
    ],
    renamingSessionId: '',
    selectedModelId: defaultModelId,
    selectedProjectId: defaultProjectId,
    selectedSessionId: defaultSessionId,
    sessions: [
      {
        id: defaultSessionId,
        messages: [],
        projectId: defaultProjectId,
        title: Strings.defaultSessionTitle(),
      },
    ],
    streamingEnabled: true,
    tokensMax: 0,
    tokensUsed: 0,
    uid: 0,
    usageOverviewEnabled: false,
    useChatNetworkWorkerForRequests: false,
    useMockApi: false,
    viewMode: 'list',
    warningCount: 0,
    webSearchEnabled: true,
    width: 0,
    x: 0,
    y: 0,
  }
}
