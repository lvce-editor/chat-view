import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when chat states are equal', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = { ...createDefaultState(), sessions }
  const newState: ChatState = { ...createDefaultState(), sessions }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderValue when composer changes from script input', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    inputSource: 'script',
    sessions,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 5,
    composerSelectionStart: 5,
    composerValue: 'hello',
    inputSource: 'script',
    sessions,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderValue, DiffType.RenderSelection])
})

test('diff should not return RenderValue when composer changes from user input', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    inputSource: 'script',
    sessions,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 5,
    composerSelectionStart: 5,
    composerValue: 'hello',
    inputSource: 'user',
    sessions,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderSelection])
})

test('diff should return RenderValue when openai api key input changes', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = {
    ...createDefaultState(),
    openApiApiKeyInput: '',
    sessions,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    openApiApiKeyInput: 'invalid-key',
    sessions,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderValue])
})

test('diff should return RenderSelection when composer selection changes', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = { ...createDefaultState(), composerSelectionEnd: 0, composerSelectionStart: 0, sessions }
  const newState: ChatState = { ...createDefaultState(), composerSelectionEnd: 4, composerSelectionStart: 2, sessions }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderSelection])
})

test('diff should return RenderIncremental when selected session changes', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), selectedSessionId: 'session-2' }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when sessions array changes', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
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
  const oldState: ChatState = { ...createDefaultState(), sessions, uid: 1 }
  const newState: ChatState = { ...createDefaultState(), sessions, uid: 2 }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderCss when initial changes', () => {
  const oldState: ChatState = { ...createDefaultState(), initial: true }
  const newState: ChatState = { ...createDefaultState(), initial: false }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff should return RenderFocus when composer focus is requested', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = { ...createDefaultState(), focus: 'composer', focused: false, sessions }
  const newState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true, sessions }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderFocus, DiffType.RenderFocusContext])
})

test('diff should return RenderScrollTop when scroll positions change', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = { ...createDefaultState(), sessions }
  const newState: ChatState = {
    ...createDefaultState(),
    chatListScrollTop: 10,
    sessions,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderScrollTop])
})

test('diff should return RenderScrollTop when project list scroll position changes', () => {
  const { sessions } = createDefaultState()
  const oldState: ChatState = { ...createDefaultState(), sessions }
  const newState: ChatState = {
    ...createDefaultState(),
    projectListScrollTop: 10,
    sessions,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderScrollTop])
})
