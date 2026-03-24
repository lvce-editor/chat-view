import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetSystemPrompt from '../src/parts/GetSystemPrompt/GetSystemPrompt.ts'

test('getSystemPrompt should return system prompt from state', () => {
  const state = {
    ...createDefaultState(),
    systemPrompt: 'You are a coding assistant.',
  }
  expect(GetSystemPrompt.getSystemPrompt(state)).toBe('You are a coding assistant.')
})
