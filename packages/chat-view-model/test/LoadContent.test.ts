import { expect, test } from '@jest/globals'
import { RpcId } from '@lvce-editor/constants'
import { ChatMessageParsingWorker, ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../src/parts/ChatSession/ChatSession.ts'
import type { LoadContentState } from '../src/parts/LoadContent/LoadContent.ts'
import { saveChatSession } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as MockBackendAuth from '../src/parts/MockBackendAuth/MockBackendAuth.ts'

const createState = (): LoadContentState => {
  return {
    addContextButtonEnabled: false,
    agentMode: 'agent',
    agentModePickerOpen: true,
    aiSessionTitleGenerationEnabled: false,
    authAccessToken: '',
    authEnabled: false,
    authErrorMessage: '',
    authUseRedirect: false,
    backendUrl: '',
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    chatHistoryEnabled: false,
    chatListScrollTop: 0,
    composerAttachmentPreviewOverlayAttachmentId: '',
    composerAttachmentPreviewOverlayError: false,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    composerDropActive: true,
    composerDropEnabled: false,
    composerFontFamily: 'monospace',
    composerFontSize: 13,
    composerHeight: 40,
    composerLineHeight: 20,
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    emitStreamingFunctionCallEvents: false,
    focus: 'composer',
    focused: false,
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
    hasSpaceForAgentModePicker: true,
    hasSpaceForRunModePicker: true,
    initial: true,
    lastSubmittedSessionId: '',
    lastNormalViewMode: 'list',
    listFocusedIndex: 0,
    listFocusOutline: false,
    messagesAutoScrollEnabled: true,
    messagesScrollTop: 0,
    modelPickerHeaderHeight: 30,
    modelPickerHeight: 0,
    modelPickerListScrollTop: 0,
    modelPickerOpen: true,
    modelPickerSearchValue: 'draft',
    models: [
      { id: 'model-1', name: 'Model 1' },
      { id: 'model-2', name: 'Model 2' },
    ],
    openApiApiKey: '',
    openApiApiKeyInput: '',
    openApiApiKeyInputPattern: '.*',
    openApiApiKeysSettingsUrl: 'https://example.com/openapi',
    openApiApiKeyState: 'idle',
    openRouterApiKey: '',
    openRouterApiKeyInput: '',
    openRouterApiKeyState: 'idle',
    parsedMessages: [],
    passIncludeObfuscation: false,
    projectExpandedIds: [],
    projectListScrollTop: 0,
    projects: [
      { id: 'project-blank', name: '_blank', uri: '' },
      { id: 'project-1', name: 'Project 1', uri: 'file:///workspace' },
    ],
    projectSidebarResizing: true,
    projectSidebarWidth: 240,
    reasoningEffort: 'low',
    reasoningEffortPickerOpen: true,
    reasoningPickerEnabled: false,
    runMode: 'local',
    runModePickerOpen: true,
    scrollDownButtonEnabled: false,
    searchEnabled: false,
    searchFieldVisible: true,
    searchValue: 'draft',
    selectChevronEnabled: true,
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    showChatListTime: false,
    showModelUsageMultiplier: false,
    showRunMode: false,
    streamingEnabled: false,
    systemPrompt: '',
    todoListToolEnabled: false,
    tokensMax: 0,
    tokensUsed: 0,
    toolEnablement: {},
    uid: 1,
    usageOverviewEnabled: false,
    useAuthWorker: false,
    useChatCoordinatorWorker: false,
    useChatMathWorker: false,
    useChatNetworkWorkerForRequests: false,
    useChatToolWorker: false,
    useModelWorker: false,
    useOwnBackend: false,
    userName: '',
    userState: 'loggedOut',
    userSubscriptionPlan: '',
    userUsedTokens: 0,
    viewMode: 'list',
    visibleModels: [],
    voiceDictationEnabled: false,
    width: 800,
  }
}

const cloneSession = (session: ChatSession): ChatSession => {
  return {
    ...session,
    messages: session.messages.map((message) => ({ ...message })),
  }
}

const registerMockChatStorageRpc = (): ReturnType<typeof ChatStorageWorker.registerMockRpc> => {
  const sessions = new Map<string, ChatSession>()
  const attachmentEvents = new Map<string, readonly unknown[]>([
    [
      'session-2',
      [
        {
          attachmentId: 'attachment-1',
          blob: new Blob(['hello from file'], { type: 'text/plain' }),
          mimeType: 'text/plain',
          name: 'readme.md',
          sessionId: 'session-2',
          size: 15,
          timestamp: new Date().toISOString(),
          type: 'chat-attachment-added',
        },
      ],
    ],
  ])

  return ChatStorageWorker.registerMockRpc({
    'ChatStorage.getEvents': (sessionId?: string) => {
      return sessionId ? attachmentEvents.get(sessionId) || [] : []
    },
    'ChatStorage.getSession': (id: string) => {
      const session = sessions.get(id)
      return session ? cloneSession(session) : undefined
    },
    'ChatStorage.listSessions': () => {
      return Array.from(sessions.values(), cloneSession)
    },
    'ChatStorage.subscribeSessionUpdates': async () => {},
    'ChatStorage.setSession': (session: ChatSession) => {
      sessions.set(session.id, cloneSession(session))
    },
  })
}

test('loadContent copies orchestration logic into chat-view-model', async () => {
  const state = createState()
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      switch (key) {
        case 'chat.authEnabled':
        case 'chat.authUseRedirect':
        case 'chatView.aiSessionTitleGenerationEnabled':
        case 'chatView.composerDropEnabled':
        case 'chatView.emitStreamingFunctionCallEvents':
        case 'chatView.passIncludeObfuscation':
        case 'chatView.reasoningPickerEnabled':
        case 'chatView.runModePickerEnabled':
        case 'chatView.scrollDownButtonEnabled':
        case 'chatView.searchEnabled':
        case 'chatView.showChatListTime':
        case 'chatView.streamingEnabled':
        case 'chatView.todoListToolEnabled':
        case 'chatView.useAuthWorker':
        case 'chatView.useChatCoordinatorWorker':
        case 'chatView.useChatMathWorker':
        case 'chatView.useChatNetworkWorkerForRequests':
        case 'chatView.useChatToolWorker':
        case 'chatView.voiceDictationEnabled':
          return true
        case 'chat.backendUrl':
          return 'https://example.com'
        case 'chat.chatHistoryEnabled':
          return true
        case 'chat.toolEnablement':
          return { grep: true }
        case 'chat.useOwnBackend':
          return false
        case 'secrets.openApiKey':
          return 'open-api-key'
        case 'secrets.openRouterApiKey':
          return 'open-router-key'
        default:
          return undefined
      }
    },
  })
  expect(mockRendererRpc).toBeDefined()
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(() => []),
  })
  expect(mockChatMessageParsingRpc).toBeDefined()
  MockBackendAuth.setNextRefreshResponse({
    delay: 0,
    response: {
      accessToken: 'access-token',
      subscriptionPlan: 'pro',
      usedTokens: 42,
      userName: 'Simon',
    },
    type: 'success',
  })
  await saveChatSession({ id: 'session-1', messages: [], title: 'Session 1' })
  await saveChatSession({
    id: 'session-2',
    messages: [{ id: 'message-1', role: 'user', text: 'Hello', time: '10:00' }],
    title: 'Session 2',
  })
  const savedState = {
    chatListScrollTop: 12,
    composerSelectionEnd: 4,
    composerSelectionStart: 2,
    composerValue: 'saved composer',
    messagesScrollTop: 14,
    projectExpandedIds: ['project-1'],
    projectListScrollTop: 16,
    projectSidebarWidth: 260,
    reasoningEffort: 'high' as const,
    selectedModelId: 'model-2',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-2',
    viewMode: 'detail' as const,
  }

  try {
    const result = await loadContent(state, savedState)

    expect(result.selectedSessionId).toBe('session-2')
    expect(result.selectedModelId).toBe('model-2')
    expect(result.composerValue).toBe('saved composer')
    expect(result.composerSelectionStart).toBe(2)
    expect(result.composerSelectionEnd).toBe(4)
    expect(result.sessions).toEqual([
      { id: 'session-1', messages: [], title: 'Session 1' },
      { id: 'session-2', lastActiveTime: '10:00', messages: [{ id: 'message-1', role: 'user', text: 'Hello', time: '10:00' }], title: 'Session 2' },
    ])
    expect(result.parsedMessages).toEqual([{ id: 'message-1', parsedContent: [], text: 'Hello' }])
    expect(result.visibleModels).toEqual([
      { id: 'model-1', name: 'Model 1' },
      { id: 'model-2', name: 'Model 2' },
    ])
    expect(result.composerAttachments).toEqual([
      {
        attachmentId: 'attachment-1',
        displayType: 'text-file',
        mimeType: 'text/plain',
        name: 'readme.md',
        size: 15,
        textContent: 'hello from file',
      },
    ])
    expect(result.initial).toBe(false)
    expect(result.modelPickerHeight).toBe(86)
    expect(result.composerAttachmentsHeight).toBe(34)
    expect(result.projectExpandedIds).toEqual(['project-1'])
    expect(result.showModelUsageMultiplier).toBe(true)
    expect(result.showRunMode).toBe(true)
    expect(result.userName).toBe('Simon')
    expect(result.userState).toBe('loggedIn')
    expect(result.voiceDictationEnabled).toBe(true)
    expect(mockChatStorageRpc.invocations).toContainEqual([
      'ChatStorage.subscribeSessionUpdates',
      { rpcId: RpcId.RendererWorker, sessionId: 'session-2', type: 'session', uid: 1 },
    ])
  } finally {
    MockBackendAuth.clear()
  }
})
