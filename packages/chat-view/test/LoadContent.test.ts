import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should initialize view and keep existing session', async () => {
  const state: ChatState = { ...createDefaultState(), initial: true, uid: 1 }
  const result = await LoadContent.loadContent(state)
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
  const result = await LoadContent.loadContent(state)
  expect(result.disposed).toBe(true)
  expect(result.uid).toBe(2)
  expect(result.initial).toBe(false)
})

test('loadContent should create fallback session when sessions are empty', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    nextSessionId: 5,
    selectedSessionId: '',
    sessions: [],
    uid: 3,
  }
  const result = await LoadContent.loadContent(state)
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  expect(result.sessions[0].title).toBe('Chat 5')
  expect(result.selectedSessionId).toBe(result.sessions[0].id)
  expect(result.nextSessionId).toBe(6)
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
  const result = await LoadContent.loadContent(state)
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
