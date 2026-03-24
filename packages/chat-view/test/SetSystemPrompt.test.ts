import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetSystemPrompt from '../src/parts/SetSystemPrompt/SetSystemPrompt.ts'

test('setSystemPrompt should update systemPrompt', () => {
  const state = createDefaultState()
  const result = SetSystemPrompt.setSystemPrompt(state, 'Use concise responses')
  expect(result.systemPrompt).toBe('Use concise responses')
})

test('setSystemPrompt should return new state object', () => {
  const state = createDefaultState()
  const result = SetSystemPrompt.setSystemPrompt(state, 'new prompt')
  expect(result).not.toBe(state)
})
