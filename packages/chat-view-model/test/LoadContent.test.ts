import { expect, test } from '@jest/globals'
import type { LoadContentDependencies, LoadContentState } from '../src/parts/LoadContent/LoadContent.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'

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
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
    hasSpaceForAgentModePicker: true,
    hasSpaceForRunModePicker: true,
    initial: true,
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
    showRunMode: false,
    streamingEnabled: false,
    todoListToolEnabled: false,
    tokensMax: 0,
    tokensUsed: 0,
    toolEnablement: {},
    usageOverviewEnabled: false,
    useAuthWorker: false,
    useChatCoordinatorWorker: false,
    useChatMathWorker: false,
    useChatNetworkWorkerForRequests: false,
    useChatToolWorker: false,
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

const createDependencies = (): LoadContentDependencies => {
  return {
    ensureBlankProject: (projects) => projects,
    getComposerAttachments: async () => [{ attachmentId: 'attachment-1', displayType: 'file', mimeType: 'text/plain', name: 'readme.md', size: 10 }],
    getComposerAttachmentsHeight: () => 24,
    getLoggedOutBackendAuthState: () => ({
      authAccessToken: '',
      authErrorMessage: '',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    }),
    getModelPickerHeight: (_headerHeight, visibleModelCount) => visibleModelCount * 10,
    getSavedAgentMode: () => undefined,
    getSavedChatListScrollTop: () => 12,
    getSavedComposerSelection: () => [2, 4],
    getSavedComposerValue: () => 'saved composer',
    getSavedLastNormalViewMode: () => undefined,
    getSavedMessagesScrollTop: () => 14,
    getSavedProjectExpandedIds: () => ['project-1'],
    getSavedProjectListScrollTop: () => 16,
    getSavedProjectSidebarWidth: () => 260,
    getSavedProjects: () => undefined,
    getSavedReasoningEffort: () => 'high',
    getSavedSelectedModelId: () => 'model-2',
    getSavedSelectedProjectId: () => 'project-1',
    getSavedSelectedSessionId: () => 'session-2',
    getSavedSessions: () => undefined,
    getSavedViewMode: () => 'detail',
    getVisibleModels: (models) => models,
    getVisibleSessions: (sessions) => sessions,
    listChatSessions: async () => [
      { id: 'session-1', messages: [], title: 'Session 1' },
      { id: 'session-2', messages: [{ id: 'message-1', role: 'user', text: 'Hello', time: '10:00' }], title: 'Session 2' },
    ],
    loadPreferences: async () => ({
      aiSessionTitleGenerationEnabled: true,
      authEnabled: true,
      authUseRedirect: true,
      backendUrl: 'https://example.com',
      chatHistoryEnabled: true,
      composerDropEnabled: true,
      emitStreamingFunctionCallEvents: true,
      openApiApiKey: 'open-api-key',
      openRouterApiKey: 'open-router-key',
      passIncludeObfuscation: true,
      reasoningPickerEnabled: true,
      runModePickerEnabled: true,
      scrollDownButtonEnabled: true,
      searchEnabled: true,
      showChatListTime: true,
      streamingEnabled: true,
      todoListToolEnabled: true,
      toolEnablement: { grep: true },
      useAuthWorker: true,
      useChatCoordinatorWorker: true,
      useChatMathWorker: true,
      useChatNetworkWorkerForRequests: true,
      useChatToolWorker: true,
      useOwnBackend: false,
      voiceDictationEnabled: true,
    }),
    loadSelectedSessionMessages: async (sessions) => sessions,
    normalizeSessionsOnLoad: (sessions) => sessions,
    parseAndStoreMessagesContent: async (parsedMessages, messages) => {
      if (messages.length === 0) {
        return parsedMessages
      }
      return [{ id: 'message-1', parsedContent: [], text: 'Hello' }]
    },
    refreshGitBranchPickerVisibility: async (state) => state,
    saveChatSession: async () => {},
    syncBackendAuth: async () => ({
      authAccessToken: 'access-token',
      authErrorMessage: '',
      userName: 'Simon',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    }),
    toSummarySession: (session) => session,
  }
}

test('loadContent copies orchestration logic into chat-view-model', async () => {
  const state = createState()
  const dependencies = createDependencies()

  const result = await loadContent(state, {}, dependencies)

  expect(result.selectedSessionId).toBe('session-2')
  expect(result.selectedModelId).toBe('model-2')
  expect(result.composerValue).toBe('saved composer')
  expect(result.composerSelectionStart).toBe(2)
  expect(result.composerSelectionEnd).toBe(4)
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], title: 'Session 1' },
    { id: 'session-2', messages: [{ id: 'message-1', role: 'user', text: 'Hello', time: '10:00' }], title: 'Session 2' },
  ])
  expect(result.parsedMessages).toEqual([{ id: 'message-1', parsedContent: [], text: 'Hello' }])
  expect(result.visibleModels).toEqual([
    { id: 'model-1', name: 'Model 1' },
    { id: 'model-2', name: 'Model 2' },
  ])
  expect(result.initial).toBe(false)
  expect(result.modelPickerHeight).toBe(20)
  expect(result.projectExpandedIds).toEqual(['project-1'])
  expect(result.showRunMode).toBe(true)
  expect(result.userName).toBe('Simon')
  expect(result.userState).toBe('loggedIn')
  expect(result.voiceDictationEnabled).toBe(true)
})
