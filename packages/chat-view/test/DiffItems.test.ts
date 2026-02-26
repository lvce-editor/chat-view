import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true for identical state object', () => {
  const state: StatusBarState = createDefaultState()
  expect(DiffItems.isEqual(state, state)).toBe(true)
})

test('isEqual should return true for equivalent chat state', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }] as const
  const state1: StatusBarState = { ...createDefaultState(), sessions }
  const state2: StatusBarState = { ...createDefaultState(), sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when composer changes', () => {
  const state1: StatusBarState = { ...createDefaultState(), composerValue: 'a' }
  const state2: StatusBarState = { ...createDefaultState(), composerValue: 'b' }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when selectedSessionId changes', () => {
  const state1: StatusBarState = createDefaultState()
  const state2: StatusBarState = { ...createDefaultState(), selectedSessionId: 'session-2' }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when sessions reference changes', () => {
  const state1: StatusBarState = createDefaultState()
  const state2: StatusBarState = {
    ...createDefaultState(),
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should ignore uid when chat fields are equal', () => {
  const sessions = createDefaultState().sessions
  const state1: StatusBarState = { ...createDefaultState(), sessions, uid: 1 }
  const state2: StatusBarState = { ...createDefaultState(), sessions, uid: 2 }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})
