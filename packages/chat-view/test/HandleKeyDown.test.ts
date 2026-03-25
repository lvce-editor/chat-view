import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleKeyDown from '../src/parts/HandleKeyDown/HandleKeyDown.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleKeyDown should submit on Enter', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'hello', viewMode: 'detail' as const }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleKeyDown should create a new session on Enter from list mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
    lastNormalViewMode: 'detail' as const,
    viewMode: 'list' as const,
  }

  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)

  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(newSession?.id).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(newSession?.messages[0]?.text).toBe('hello')
  expect(result.viewMode).toBe('detail')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
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
  const state = { ...createDefaultState(), composerValue: 'Renamed Chat', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].title).toBe('Renamed Chat')
  expect(result.renamingSessionId).toBe('')
})

test('handleKeyDown should clear rename mode when rename value is blank', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: '   ', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.renamingSessionId).toBe('')
  expect(result.sessions[0].title).toBe('Chat 1')
})

test('handleKeyDown should not submit blank message', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
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
