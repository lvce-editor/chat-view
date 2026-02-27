import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'

test('handleInput should update composer value', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'hello', 'user')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('user')
})

test('handleInput should mark script input source', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'hello', 'script')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('script')
})
