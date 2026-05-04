import { expect, test } from '@jest/globals'
import { AuthWorker, ChatMessageParsingWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { saveChatSession } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'
import * as ToggleChatFocusMode from '../src/parts/ToggleChatFocusMode/ToggleChatFocusMode.ts'

const expectInvocations = (actual: readonly (readonly [string, string])[], expected: readonly (readonly [string, string])[]): void => {
  expect(actual.length).toBeGreaterThanOrEqual(expected.length)
  expect(actual).toEqual(expect.arrayContaining([...expected]))
}

test('loadContent should initialize view and keep existing session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = { ...createDefaultState(), initial: true, uid: 1 }
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.initial).toBe(false)
  expect(result.sessions).toHaveLength(1)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.uid).toBe(1)
})

test('loadContent should preserve existing state properties', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
    uid: 2,
  }
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.disposed).toBe(true)
  expect(result.uid).toBe(2)
  expect(result.initial).toBe(false)
})

test('loadContent should keep sessions empty when sessions are empty', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: '',
    sessions: [],
    uid: 3,
    viewMode: 'detail',
  }
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.sessions).toHaveLength(0)
  expect(result.selectedSessionId).toBe('')
  expect(result.viewMode).toBe('list')
})

test('loadContent should recover selectedSessionId when it does not exist', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'missing',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.sessions).toHaveLength(2)
})

test('loadContent should restore chat list items from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }
  const savedState = {
    selectedSessionId: 'session-b',
    sessions: [
      { id: 'session-a', messages: [], title: 'Saved A' },
      { id: 'session-b', messages: [], title: 'Saved B' },
    ],
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.sessions).toEqual(savedState.sessions)
  expect(result.selectedSessionId).toBe('session-b')
})

test('loadContent should restore sessions from savedState and recover invalid selected session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }
  const savedState = {
    selectedSessionId: 'missing',
    sessions: [{ id: 'session-z', messages: [], title: 'Saved Z' }],
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.sessions).toEqual(savedState.sessions)
  expect(result.selectedSessionId).toBe('session-z')
})

test('loadContent should load only selected session messages from async storage', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(() => []),
  })
  expect(mockChatMessageParsingRpc).toBeDefined()
  await saveChatSession({
    id: 'session-a',
    messages: [{ id: 'message-a', role: 'user', text: 'A', time: '10:00' }],
    title: 'Saved A',
  })
  await saveChatSession({
    id: 'session-b',
    messages: [{ id: 'message-b', role: 'assistant', text: 'B', time: '10:01' }],
    title: 'Saved B',
  })
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    viewMode: 'detail',
  }
  const savedState = {
    selectedSessionId: 'session-b',
    viewMode: 'detail' as const,
  }

  const result = await LoadContent.loadContent(state, savedState)
  expect(result.sessions).toEqual([
    { id: 'session-a', lastActiveTime: '10:00', messages: [], title: 'Saved A' },
    {
      id: 'session-b',
      lastActiveTime: '10:01',
      messages: [{ id: 'message-b', role: 'assistant', text: 'B', time: '10:01' }],
      title: 'Saved B',
    },
  ])
  expect(result.selectedSessionId).toBe('session-b')
  expect(result.viewMode).toBe('detail')
})

test('loadContent should keep window bounds from current state', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    height: 40,
    width: 30,
    x: 10,
    y: 20,
  }
  const savedState = {
    height: 140,
    width: 130,
    x: 110,
    y: 120,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.x).toBe(10)
  expect(result.y).toBe(20)
  expect(result.width).toBe(30)
  expect(result.height).toBe(40)
})

test('loadContent should restore selectedModelId from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedModelId: 'test',
  }
  const savedState = {
    selectedModelId: 'claude-code',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.selectedModelId).toBe('claude-code')
})

test('loadContent should ignore systemPrompt from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    systemPrompt: 'Use the in-code system prompt.',
  }
  const savedState = {
    systemPrompt: 'You are an expert TypeScript coding assistant.',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.systemPrompt).toBe('Use the in-code system prompt.')
})

test('loadContent should restore detail view from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    viewMode: 'list',
  }
  const savedState = {
    viewMode: 'detail',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.viewMode).toBe('detail')
})

test('loadContent should preserve selected session branch metadata for chat focus branch picker fallback', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    viewMode: 'list',
  }
  const savedState = {
    selectedSessionId: 'session-branch',
    sessions: [
      {
        branchName: 'main',
        id: 'session-branch',
        messages: [],
        title: 'Branch Session',
        workspaceUri: 'file:///workspace',
      },
    ],
    viewMode: 'detail' as const,
  }

  const loaded = await LoadContent.loadContent(state, savedState)
  expect(loaded.selectedSessionId).toBe('session-branch')
  expect(loaded.sessions[0].branchName).toBe('main')
  expect(loaded.sessions[0].workspaceUri).toBe('file:///workspace')

  const focused = await ToggleChatFocusMode.toggleChatFocusMode(loaded)
  expect(focused.viewMode).toBe('chat-focus')
  expect(focused.gitBranchPickerVisible).toBe(true)
  expect(focused.gitBranches).toEqual([{ current: true, name: 'main' }])
})

test('loadContent should restore scroll positions from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    chatListScrollTop: 1,
    messagesScrollTop: 2,
  }
  const savedState = {
    chatListScrollTop: 140,
    messagesScrollTop: 260,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.chatListScrollTop).toBe(140)
  expect(result.messagesScrollTop).toBe(260)
})

test('loadContent should restore composerValue from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'draft from state',
  }
  const savedState = {
    composerValue: 'draft from saved state',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.composerValue).toBe('draft from saved state')
})

test('loadContent should restore composer selection from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 3,
    composerSelectionStart: 1,
    composerValue: 'draft from state',
  }
  const savedState = {
    composerSelectionEnd: 8,
    composerSelectionStart: 2,
    composerValue: 'draft from saved state',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.composerSelectionStart).toBe(2)
  expect(result.composerSelectionEnd).toBe(8)
})

test('loadContent should normalize invalid saved composer selection', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 3,
    composerSelectionStart: 1,
    composerValue: 'draft from state',
  }
  const savedState = {
    composerSelectionEnd: 100,
    composerSelectionStart: -2,
    composerValue: 'draft',
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.composerSelectionStart).toBe(0)
  expect(result.composerSelectionEnd).toBe(5)
})

test('loadContent should ignore incomplete saved composer selection', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 3,
    composerSelectionStart: 1,
  }
  const savedState = {
    composerSelectionStart: 4,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.composerSelectionStart).toBe(1)
  expect(result.composerSelectionEnd).toBe(3)
})

test('loadContent should ignore invalid saved composerValue', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'draft from state',
  }
  const savedState = {
    composerValue: 123,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.composerValue).toBe('draft from state')
})

test('loadContent should ignore invalid saved scroll positions', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    chatListScrollTop: 33,
    messagesScrollTop: 44,
  }
  const savedState = {
    chatListScrollTop: 'bad',
    messagesScrollTop: null,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.chatListScrollTop).toBe(33)
  expect(result.messagesScrollTop).toBe(44)
})

test('loadContent should restore selected detail session with messages from savedState', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(() => []),
  })
  expect(mockChatMessageParsingRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    viewMode: 'list',
  }
  const savedMessages = [
    { id: 'message-1', role: 'user' as const, text: 'Hello', time: '10:00' },
    { id: 'message-2', role: 'assistant' as const, text: 'Hi there', time: '10:01' },
  ]
  const savedState = {
    selectedSessionId: 'session-b',
    sessions: [
      { id: 'session-a', messages: [], title: 'Saved A' },
      { id: 'session-b', messages: savedMessages, title: 'Saved B' },
    ],
    viewMode: 'detail' as const,
  }
  const result = await LoadContent.loadContent(state, savedState)
  expect(result.selectedSessionId).toBe('session-b')
  expect(result.viewMode).toBe('detail')
  expect(result.sessions).toEqual([
    { id: 'session-a', messages: [], title: 'Saved A' },
    { id: 'session-b', lastActiveTime: '10:01', messages: savedMessages, title: 'Saved B' },
  ])
})

test('loadContent should load openRouterApiKey from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return 'or-key-123'
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.openRouterApiKey).toBe('or-key-123')
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chat.authEnabled'],
    ['Preferences.get', 'chat.authUseRedirect'],
    ['Preferences.get', 'chat.backendUrl'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load openApiApiKey from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return 'oa-key-123'
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.openApiApiKey).toBe('oa-key-123')
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chat.authEnabled'],
    ['Preferences.get', 'chat.authUseRedirect'],
    ['Preferences.get', 'chat.backendUrl'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should sync backend auth state when auth is enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getUserInfo': async () => ({
      authAccessToken: 'access-token-1',
      authErrorMessage: '',
      userName: 'test-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    }),
    'Preferences.get': async (key: string) => {
      if (key === 'chat.authEnabled') {
        return true
      }
      if (key === 'chat.authUseRedirect') {
        return true
      }
      if (key === 'chat.backendUrl') {
        return 'https://backend.example.com'
      }
      return undefined
    },
  })
  const result = await LoadContent.loadContent(createDefaultState(), undefined)
  expect(result.authAccessToken).toBe('access-token-1')
  expect(result.authUseRedirect).toBe(true)
  expect(result.userName).toBe('test-user')
  expect(result.userState).toBe('loggedIn')
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.authEnabled'])
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.authUseRedirect'])
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.backendUrl'])
  expect(mockRpc.invocations).toContainEqual(['Layout.getUserInfo'])
})

test('loadContent should load useOwnBackend from preferences and sync backend auth state', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getUserInfo': async () => ({
      authAccessToken: 'access-token-2',
      authErrorMessage: '',
      userName: 'backend-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 7,
    }),
    'Preferences.get': async (key: string) => {
      if (key === 'chat.useOwnBackend') {
        return true
      }
      if (key === 'chat.backendUrl') {
        return 'https://backend.example.com'
      }
      return undefined
    },
  })
  const result = await LoadContent.loadContent(createDefaultState(), undefined)
  expect(result.useOwnBackend).toBe(true)
  expect(result.authAccessToken).toBe('access-token-2')
  expect(result.userName).toBe('backend-user')
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.useOwnBackend'])
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.backendUrl'])
  expect(mockRpc.invocations).toContainEqual(['Layout.getUserInfo'])
})

test('loadContent should default backend url to lvce-editor.dev', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })

  const result = await LoadContent.loadContent(createDefaultState(), undefined)

  expect(result.backendUrl).toBe('https://lvce-editor.dev')
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.backendUrl'])
})

test('loadContent should load emitStreamingFunctionCallEvents from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      if (key === 'chatView.emitStreamingFunctionCallEvents') {
        return true
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.emitStreamingFunctionCallEvents).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load streamingEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      if (key === 'chatView.streamingEnabled') {
        return true
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.streamingEnabled).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load passIncludeObfuscation from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      if (key === 'chatView.passIncludeObfuscation') {
        return true
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.passIncludeObfuscation).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load composerDropEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      if (key === 'chatView.composerDropEnabled') {
        return true
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.composerDropActive).toBe(false)
  expect(result.composerDropEnabled).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load aiSessionTitleGenerationEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.aiSessionTitleGenerationEnabled') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.aiSessionTitleGenerationEnabled).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load useChatNetworkWorkerForRequests from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatNetworkWorkerForRequests') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.useChatNetworkWorkerForRequests).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load useChatCoordinatorWorker from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatCoordinatorWorker') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.useChatCoordinatorWorker).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should load useAuthWorker from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useAuthWorker') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.useAuthWorker).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.useAuthWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should sync backend auth via auth worker when enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('fetch should not be called when auth worker is enabled')
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.useOwnBackend') {
        return true
      }
      if (key === 'chat.backendUrl') {
        return 'https://backend.example.com'
      }
      if (key === 'chatView.useAuthWorker') {
        return true
      }
      if (key === 'secrets.openApiKey' || key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: 'worker-token-1',
      authErrorMessage: '',
      userName: 'worker-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 21,
    }),
  })

  try {
    const result = await LoadContent.loadContent(createDefaultState(), undefined)
    expect(result.useAuthWorker).toBe(true)
    expect(result.useOwnBackend).toBe(true)
    expect(result.authAccessToken).toBe('worker-token-1')
    expect(result.userName).toBe('worker-user')
    expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.useOwnBackend'])
    expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chat.backendUrl'])
    expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'chatView.useAuthWorker'])
    expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', 'https://backend.example.com']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('loadContent should load useChatMathWorker from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatMathWorker') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.useChatMathWorker).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
  ])
})

test('loadContent should delegate message parsing to chat message parsing worker', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  await saveChatSession({
    id: 'session-1',
    messages: [{ id: 'message-1', role: 'assistant', text: 'Hello from worker', time: '10:01' }],
    title: 'Chat 1',
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey' || key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  expect(mockRendererRpc).toBeDefined()
  const workerParsedMessages = [
    {
      id: 'message-1',
      parsedContent: [
        {
          children: [
            {
              text: 'parsed in worker',
              type: 'text',
            },
          ],
          type: 'text',
        },
      ],
      text: 'Hello from worker',
    },
  ]
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [workerParsedMessages[0].parsedContent],
  })
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    viewMode: 'detail',
  }

  const result = await LoadContent.loadContent(state, undefined)

  expect(result.parsedMessages).toEqual(workerParsedMessages)
  expect(mockChatMessageParsingRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['Hello from worker']]])
})

test('loadContent should load useChatToolWorker from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatToolWorker') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.useChatToolWorker).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
  ])
})

test('loadContent should load voiceDictationEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.voiceDictationEnabled') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.voiceDictationEnabled).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
  ])
})

test('loadContent should load todoListToolEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.todoListToolEnabled') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.todoListToolEnabled).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.todoListToolEnabled'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
  ])
})

test('loadContent should load toolEnablement from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.toolEnablement') {
        return {
          read_file: false,
          write_file: true,
        }
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.toolEnablement).toEqual({
    read_file: false,
    run_in_terminal: false,
    write_file: true,
  })
  expectInvocations(mockRpc.invocations, [['Preferences.get', 'chat.toolEnablement']])
})

test('loadContent should load searchEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.searchEnabled') {
        return true
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.searchEnabled).toBe(true)
  expect(result.searchFieldVisible).toBe(false)
  expect(result.searchValue).toBe('')
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'chatView.composerDropEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.searchEnabled'],
    ['Preferences.get', 'chatView.scrollDownButtonEnabled'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
    ['Preferences.get', 'chatView.useChatNetworkWorkerForRequests'],
    ['Preferences.get', 'chatView.useChatCoordinatorWorker'],
    ['Preferences.get', 'chatView.useChatMathWorker'],
    ['Preferences.get', 'chatView.useChatToolWorker'],
    ['Preferences.get', 'chatView.voiceDictationEnabled'],
  ])
})

test('loadContent should load showRunMode from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.runModePickerEnabled') {
        return false
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.showRunMode).toBe(false)
  expect(result.runModePickerOpen).toBe(false)
  expectInvocations(mockRpc.invocations, [['Preferences.get', 'chatView.runModePickerEnabled']])
})

test('loadContent should load showModelUsageMultiplier from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.showModelUsageMultiplier') {
        return false
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.showModelUsageMultiplier).toBe(false)
  expectInvocations(mockRpc.invocations, [['Preferences.get', 'chatView.showModelUsageMultiplier']])
})

test('loadContent should load chatHistoryEnabled from preferences', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.chatHistoryEnabled') {
        return false
      }
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.chatHistoryEnabled).toBe(false)
  expectInvocations(mockRpc.invocations, [['Preferences.get', 'chat.chatHistoryEnabled']])
})

test('loadContent should normalize in-progress sessions to stopped on reload', async () => {
  using _mockChatStorageRpc = registerMockChatStorageRpc()
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(() => []),
  })
  expect(mockChatMessageParsingRpc).toBeDefined()
  await saveChatSession({
    id: 'session-1',
    messages: [
      { id: 'msg-1', role: 'user', text: 'hello', time: '2024-01-01T00:00:00.000Z' },
      { id: 'msg-2', inProgress: true, role: 'assistant', text: 'partial response', time: '2024-01-01T00:00:01.000Z' },
    ],
    status: 'in-progress',
    title: 'Chat 1',
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  const session = result.sessions.find((s) => s.id === 'session-1')
  expect(session?.status).toBe('stopped')
  expect(session?.messages.find((m) => m.id === 'msg-2')?.inProgress).toBe(false)
})
