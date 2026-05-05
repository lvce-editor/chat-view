import { afterEach, beforeEach, expect, test } from '@jest/globals'
import { ChatViewModelWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleKeyDown from '../src/parts/HandleKeyDown/HandleKeyDown.ts'
import { registerMockChatMessageParsingRpc } from '../src/parts/TestHelpers/RegisterMockChatMessageParsingRpc.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

let mockChatMessageParsingRpc: ReturnType<typeof registerMockChatMessageParsingRpc>

beforeEach(() => {
  mockChatMessageParsingRpc = registerMockChatMessageParsingRpc()
})

afterEach(() => {
  mockChatMessageParsingRpc[Symbol.dispose]()
})

test('handleKeyDown should submit on Enter', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: 'hello', viewMode: 'detail' as const }
  const expectedState = {
    ...state,
    composerValue: '',
    focus: 'composer' as const,
    focused: true,
    sessions: [
      {
        ...state.sessions[0],
        messages: [
          { id: 'message-user-1', role: 'user' as const, text: 'hello', time: '10:00' },
          { id: 'message-assistant-1', role: 'assistant' as const, text: 'Mock AI response: I received "hello".', time: '10:01' },
        ],
      },
    ],
  }
  using mockSubmitRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => expectedState,
  })
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockSubmitRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test('handleKeyDown should create a new session on Enter from list mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
    lastNormalViewMode: 'detail' as const,
    viewMode: 'list' as const,
  }
  const expectedState = {
    ...state,
    composerValue: '',
    selectedSessionId: 'session-2',
    sessions: [
      ...state.sessions,
      {
        id: 'session-2',
        messages: [
          { id: 'message-user-1', role: 'user' as const, text: 'hello', time: '10:00' },
          { id: 'message-assistant-1', role: 'assistant' as const, text: 'Mock AI response: I received "hello".', time: '10:01' },
        ],
        projectId: state.selectedProjectId,
        status: 'finished' as const,
        title: 'Chat 2',
      },
    ],
    viewMode: 'detail' as const,
  }
  using mockSubmitRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => expectedState,
  })

  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)

  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(newSession?.id).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(newSession?.messages[0]?.text).toBe('hello')
  expect(result.viewMode).toBe('detail')
  expect(mockSubmitRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test('handleKeyDown should not submit on Shift+Enter', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', true)
  expect(result).toBe(state)
})

test('handleKeyDown should rename when in rename mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.prompt': async (title: string) => {
      expect(title).toBe('Renamed Chat')
      return 'AI Renamed Chat'
    },
  })
  const state = { ...createDefaultState(), composerValue: 'Renamed Chat', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].title).toBe('AI Renamed Chat')
  expect(result.renamingSessionId).toBe('')
  expect(mockRpc.invocations).toEqual([['Main.prompt', 'Renamed Chat']])
})

test('handleKeyDown should clear rename mode when rename value is blank', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: '   ', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.renamingSessionId).toBe('')
  expect(result.sessions[0].title).toBe('Chat 1')
})

test('handleKeyDown should keep existing title when prompted rename is blank', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.prompt': async () => '   ',
  })
  const state = { ...createDefaultState(), composerValue: 'Renamed Chat', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.renamingSessionId).toBe('')
  expect(result.sessions[0].title).toBe('Chat 1')
  expect(mockRpc.invocations).toEqual([['Main.prompt', 'Renamed Chat']])
})

test('handleKeyDown should not submit blank message', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: '   ' }
  using mockSubmitRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => state,
  })
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
  expect(mockSubmitRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test('handleKeyDown should ignore non-enter keys', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Escape', false)
  expect(result).toBe(state)
})

test('handleKeyDown should ignore ArrowUp because navigation is command-keybinding based', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    chatInputHistory: ['first', 'second'],
    chatInputHistoryDraft: 'draft',
    chatInputHistoryIndex: -1,
    composerValue: 'draft',
    focus: 'composer',
  }
  const result = await HandleKeyDown.handleKeyDown(state, 'ArrowUp', false)
  expect(result).toBe(state)
})

test('handleKeyDown should not navigate history when chat history is disabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    chatHistoryEnabled: false,
    chatInputHistory: ['first'],
    composerValue: 'draft',
    focus: 'composer',
  }
  const result = await HandleKeyDown.handleKeyDown(state, 'ArrowUp', false)
  expect(result).toBe(state)
})

test('handleKeyDown should ignore ArrowDown in list focus because navigation is command-keybinding based', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = { ...createDefaultState(), focus: 'list', focused: true, listFocusedIndex: -1 }
  const result = await HandleKeyDown.handleKeyDown(state, 'ArrowDown', false)
  expect(result).toBe(state)
})
