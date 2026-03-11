import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { resetChatSessionStorage, saveChatSession } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

const expectInvocations = (actual: readonly (readonly [string, string])[], expected: readonly (readonly [string, string])[]): void => {
  expect(actual).toHaveLength(expected.length)
  expect(actual).toEqual(expect.arrayContaining([...expected]))
}

test('loadContent should initialize view and keep existing session', async () => {
  const state: ChatState = { ...createDefaultState(), initial: true, uid: 1 }
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.initial).toBe(false)
  expect(result.sessions).toHaveLength(1)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.uid).toBe(1)
})

test('loadContent should preserve existing state properties', async () => {
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
    { id: 'session-a', messages: [], title: 'Saved A' },
    { id: 'session-b', messages: [{ id: 'message-b', role: 'assistant', text: 'B', time: '10:01' }], title: 'Saved B' },
  ])
  expect(result.selectedSessionId).toBe('session-b')
  expect(result.viewMode).toBe('detail')
})

test('loadContent should keep window bounds from current state', async () => {
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

test('loadContent should restore detail view from savedState', async () => {
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

test('loadContent should restore scroll positions from savedState', async () => {
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

test('loadContent should ignore invalid saved scroll positions', async () => {
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
  expect(result.sessions).toEqual(savedState.sessions)
})

test('loadContent should load openRouterApiKey from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load openApiApiKey from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load emitStreamingFunctionCallEvents from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load streamingEnabled from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load passIncludeObfuscation from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load openApiUseWebSocket from preferences', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'secrets.openApiKey') {
        return ''
      }
      if (key === 'secrets.openRouterApiKey') {
        return ''
      }
      if (key === 'chatView.openApiUseWebSocket') {
        return true
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.openApiUseWebSocket).toBe(true)
  expectInvocations(mockRpc.invocations, [
    ['Preferences.get', 'chatView.aiSessionTitleGenerationEnabled'],
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})

test('loadContent should load aiSessionTitleGenerationEnabled from preferences', async () => {
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
    ['Preferences.get', 'secrets.openApiKey'],
    ['Preferences.get', 'secrets.openApiApiKey'],
    ['Preferences.get', 'secrets.openAiApiKey'],
    ['Preferences.get', 'chatView.openApiUseWebSocket'],
    ['Preferences.get', 'secrets.openRouterApiKey'],
    ['Preferences.get', 'chatView.emitStreamingFunctionCallEvents'],
    ['Preferences.get', 'chatView.streamingEnabled'],
    ['Preferences.get', 'chatView.passIncludeObfuscation'],
  ])
})
