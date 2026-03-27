import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffValue from '../src/parts/DiffValue/DiffValue.ts'

function createState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    ...createDefaultState(),
    ...overrides,
  }
}

test('diffValue should return true when composerValue is unchanged', () => {
  const oldState = createState({ composerValue: 'hello' })
  const newState = createState({ composerValue: 'hello' })
  expect(DiffValue.diffValue(oldState, newState)).toBe(true)
})

test('diffValue should return false when composerValue changes', () => {
  const oldState = createState({ composerValue: 'a' })
  const newState = createState({ composerValue: 'b' })
  expect(DiffValue.diffValue(oldState, newState)).toBe(false)
})
