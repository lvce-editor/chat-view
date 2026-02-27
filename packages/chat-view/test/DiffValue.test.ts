import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffValue from '../src/parts/DiffValue/DiffValue.ts'

test('diffValue should return true when composerValue is unchanged', () => {
  const oldState: ChatState = { ...createDefaultState(), composerValue: 'hello' }
  const newState: ChatState = { ...createDefaultState(), composerValue: 'hello' }
  expect(DiffValue.diffValue(oldState, newState)).toBe(true)
})

test('diffValue should return false when composerValue changes', () => {
  const oldState: ChatState = { ...createDefaultState(), composerValue: 'a' }
  const newState: ChatState = { ...createDefaultState(), composerValue: 'b' }
  expect(DiffValue.diffValue(oldState, newState)).toBe(false)
})
