import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when chat states are equal', () => {
  const { sessions } = createDefaultState()
  const oldState: StatusBarState = { ...createDefaultState(), sessions }
  const newState: StatusBarState = { ...createDefaultState(), sessions }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderIncremental when composer changes', () => {
  const oldState: StatusBarState = { ...createDefaultState(), composerValue: '' }
  const newState: StatusBarState = { ...createDefaultState(), composerValue: 'hello' }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when selected session changes', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = { ...createDefaultState(), selectedSessionId: 'session-2' }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when sessions array changes', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should ignore uid when chat fields are equal', () => {
  const { sessions } = createDefaultState()
  const oldState: StatusBarState = { ...createDefaultState(), sessions, uid: 1 }
  const newState: StatusBarState = { ...createDefaultState(), sessions, uid: 2 }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderCss when initial changes', () => {
  const oldState: StatusBarState = { ...createDefaultState(), initial: true }
  const newState: StatusBarState = { ...createDefaultState(), initial: false }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})
