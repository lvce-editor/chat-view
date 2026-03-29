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

test('diffValue should return false when openai api key input changes', () => {
  const oldState = createState({ openApiApiKeyInput: '' })
  const newState = createState({ openApiApiKeyInput: 'invalid-key' })
  expect(DiffValue.diffValue(oldState, newState)).toBe(false)
})

test('diffValue should return false when openrouter api key input changes', () => {
  const oldState = createState({ openRouterApiKeyInput: '' })
  const newState = createState({ openRouterApiKeyInput: 'or-key-typed' })
  expect(DiffValue.diffValue(oldState, newState)).toBe(false)
})
