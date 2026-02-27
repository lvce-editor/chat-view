import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffFocus from '../src/parts/DiffFocus/DiffFocus.ts'

test('diffFocus should return true when new state is not focused', () => {
  const oldState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true }
  const newState: ChatState = { ...createDefaultState(), focus: 'composer', focused: false }
  expect(DiffFocus.diffFocus(oldState, newState)).toBe(true)
})

test('diffFocus should return false when focus changes while focused', () => {
  const oldState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true }
  const newState: ChatState = { ...createDefaultState(), focus: 'send-button', focused: true }
  expect(DiffFocus.diffFocus(oldState, newState)).toBe(false)
})

test('diffFocus should return false when gaining focus on same target', () => {
  const oldState: ChatState = { ...createDefaultState(), focus: 'composer', focused: false }
  const newState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true }
  expect(DiffFocus.diffFocus(oldState, newState)).toBe(false)
})
