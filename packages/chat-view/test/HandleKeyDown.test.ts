import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleKeyDown from '../src/parts/HandleKeyDown/HandleKeyDown.ts'

test('handleKeyDown should submit on Enter', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleKeyDown should not submit on Shift+Enter', async () => {
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', true)
  expect(result).toBe(state)
})

test('handleKeyDown should rename when in rename mode', async () => {
  const state = { ...createDefaultState(), composerValue: 'Renamed Chat', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].title).toBe('Renamed Chat')
  expect(result.renamingSessionId).toBe('')
})

test('handleKeyDown should clear rename mode when rename value is blank', async () => {
  const state = { ...createDefaultState(), composerValue: '   ', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.renamingSessionId).toBe('')
  expect(result.sessions[0].title).toBe('Chat 1')
})

test('handleKeyDown should not submit blank message', async () => {
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
})

test('handleKeyDown should ignore non-enter keys', async () => {
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Escape', false)
  expect(result).toBe(state)
})

test('handleKeyDown should focus next chat list item on ArrowDown', async () => {
  const state: ChatState = { ...createDefaultState(), focus: 'list', focused: true, listFocusedIndex: -1 }
  const result = await HandleKeyDown.handleKeyDown(state, 'ArrowDown', false)
  expect(result.listFocusedIndex).toBe(0)
})

test('handleKeyDown should focus previous chat list item on ArrowUp', async () => {
  const state: ChatState = { ...createDefaultState(), focus: 'list', focused: true, listFocusedIndex: -1 }
  const result = await HandleKeyDown.handleKeyDown(state, 'ArrowUp', false)
  expect(result.listFocusedIndex).toBe(0)
})
