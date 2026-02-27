import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

test('handleClick should create a new session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'create-session')
  expect(result.sessions).toHaveLength(2)
  expect(result.selectedSessionId).toBe(result.sessions[1].id)
  expect(result.sessions[1].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
})

test('handleClick should select a session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    nextSessionId: 3,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'session:session-2')
  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
})

test('handleClick should mark session for rename and prefill composer', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session-rename:session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.composerValue).toBe('Chat 1')
})

test('handleClick should delete a session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    nextSessionId: 3,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'session-delete:session-2')
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-1')
  expect(result.selectedSessionId).toBe('session-1')
})

test('handleClick should ignore empty action name', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should ignore selecting unknown session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session:missing')
  expect(result).toBe(state)
})

test('handleClick should allow deleting last session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    nextSessionId: 2,
    renamingSessionId: 'session-1',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'session-delete:session-1')
  expect(result.sessions).toHaveLength(0)
  expect(result.selectedSessionId).toBe('')
  expect(result.renamingSessionId).toBe('')
  expect(result.viewMode).toBe('list')
  expect(result.nextSessionId).toBe(2)
})

test('handleClick should keep state for unknown action', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'unknown-action')
  expect(result).toBe(state)
})

test('handleClick should submit message when clicking send', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClick(state, 'send')
  expect(result.sessions[0].messages).toHaveLength(1)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.composerValue).toBe('')
})

test('handleClickSend should submit message', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClickSend(state)
  expect(result.sessions[0].messages).toHaveLength(1)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.composerValue).toBe('')
})

test('handleClick should go back to list mode', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    renamingSessionId: 'session-1',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'back')
  expect(result.viewMode).toBe('list')
  expect(result.renamingSessionId).toBe('')
})
