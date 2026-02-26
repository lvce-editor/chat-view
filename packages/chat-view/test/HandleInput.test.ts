import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'

test('handleInput should update composer value', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'hello')
  expect(result.composerValue).toBe('hello')
})

test('handleInput should ignore one input after submit', async () => {
  const state = { ...createDefaultState(), ignoreNextInput: true }
  const result = await HandleInput.handleInput(state, '\n')
  expect(result.composerValue).toBe('')
  expect(result.ignoreNextInput).toBe(false)
})
