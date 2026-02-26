import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should initialize view and keep existing session', async () => {
  const state: StatusBarState = { ...createDefaultState(), initial: true, uid: 1 }
  const result = await LoadContent.loadContent(state)
  expect(result.initial).toBe(false)
  expect(result.sessions).toHaveLength(1)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.uid).toBe(1)
})

test('loadContent should preserve existing state properties', async () => {
  const state: StatusBarState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
    uid: 2,
  }
  const result = await LoadContent.loadContent(state)
  expect(result.disposed).toBe(true)
  expect(result.uid).toBe(2)
  expect(result.initial).toBe(false)
})

test('loadContent should create fallback session when sessions are empty', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    nextSessionId: 5,
    selectedSessionId: '',
    sessions: [],
    uid: 3,
  }
  const result = await LoadContent.loadContent(state)
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-5')
  expect(result.sessions[0].title).toBe('Chat 5')
  expect(result.selectedSessionId).toBe('session-5')
  expect(result.nextSessionId).toBe(6)
})

test('loadContent should recover selectedSessionId when it does not exist', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    selectedSessionId: 'missing',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await LoadContent.loadContent(state)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.sessions).toHaveLength(2)
})
