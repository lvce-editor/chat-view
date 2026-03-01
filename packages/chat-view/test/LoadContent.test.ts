import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { resetChatSessionStorage, saveChatSession } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

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

test('loadContent should restore window bounds from savedState', async () => {
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
  expect(result.x).toBe(110)
  expect(result.y).toBe(120)
  expect(result.width).toBe(130)
  expect(result.height).toBe(140)
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
      if (key === 'secrets.openRouterApiKey') {
        return 'or-key-123'
      }
      return undefined
    },
  })
  const state: ChatState = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)
  expect(result.openRouterApiKey).toBe('or-key-123')
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'secrets.openRouterApiKey']])
})
