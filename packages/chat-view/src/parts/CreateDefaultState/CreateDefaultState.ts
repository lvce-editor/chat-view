/* eslint-disable @cspell/spellchecker */
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

const getDefaultModels = (): readonly ChatModel[] => {
  const defaultModelId = 'test'
  return [
    { id: defaultModelId, name: 'test', provider: 'test' },
    { id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' },
    { id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' },
    { id: 'openapi/gpt-4o', name: 'GPT-4o', provider: 'openApi' },
    { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' },
    { id: 'codex-5.3', name: 'Codex 5.3', provider: 'openRouter' },
    { id: 'claude-code', name: 'Claude Code', provider: 'openRouter' },
    { id: 'claude-haiku', name: 'Claude Haiku', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openRouter' },
    { id: 'openRouter/anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'openRouter' },
    { id: 'openRouter/google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-oss-120b:free', name: 'GPT OSS 120B (Free)', provider: 'openRouter' },
    { id: 'openRouter/meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)', provider: 'openRouter' },
    { id: 'openRouter/google/gemma-3-27b-it:free', name: 'Gemma 3 27B IT (Free)', provider: 'openRouter' },
    { id: 'openRouter/qwen/qwen3-coder:free', name: 'Qwen3 Coder (Free)', provider: 'openRouter' },
    {
      id: 'openRouter/mistralai/mistral-small-3.1-24b-instruct:free',
      name: 'Mistral Small 3.1 24B Instruct (Free)',
      provider: 'openRouter',
    },
  ]
}

export const createDefaultState = (): ChatState => {
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
    openApiUseWebSocket: false,
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    openRouterApiKeyInput: '',
    openRouterApiKeysSettingsUrl: 'https://openrouter.ai/settings/keys',
    openRouterApiKeyState: 'idle',
    passIncludeObfuscation: false,
    platform: 0,
    renamingSessionId: '',
    selectedModelId: defaultModelId,
    selectedSessionId: defaultSessionId,
    sessions: [
      {
        id: defaultSessionId,
        messages: [],
        title: Strings.defaultSessionTitle(),
      },
    ],
    streamingEnabled: true,
    tokensMax: 0,
    tokensUsed: 0,
    uid: 0,
    usageOverviewEnabled: false,
    useMockApi: false,
    viewMode: 'list',
    warningCount: 0,
    webSearchEnabled: true,
    width: 0,
    x: 0,
    y: 0,
  }
}
