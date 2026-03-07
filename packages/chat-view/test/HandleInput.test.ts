import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'

test('handleInput should update composer value', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'composer', 'hello', 'user')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('user')
})

test('handleInput should mark script input source', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'composer', 'hello', 'script')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('script')
})

test('handleInput should cap composer height based on maxComposerRows', async () => {
  const state = {
    ...createDefaultState(),
    composerLineHeight: 20,
    maxComposerRows: 3,
    width: 400,
  }
  const value = Array.from({ length: 100 }).fill('line').join('\n')
  const result = await HandleInput.handleInput(state, 'composer', value, 'user')
  expect(result.composerHeight).toBe(68)
})

test('handleInput should update openRouterApiKeyInput when editing api key textarea', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'open-router-api-key', 'or-key-abc')
  expect(result.openRouterApiKeyInput).toBe('or-key-abc')
  expect(result.composerValue).toBe('')
})

test('handleInput should update openApiApiKeyInput when editing openapi api key input', async () => {
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'open-api-api-key', 'oa-key-abc')
  expect(result.openApiApiKeyInput).toBe('oa-key-abc')
  expect(result.composerValue).toBe('')
})
