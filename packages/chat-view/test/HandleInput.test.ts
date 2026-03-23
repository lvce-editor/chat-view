import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getVisibleModels } from '../src/parts/GetVisibleModels/GetVisibleModels.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleInput should update composer value', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'composer', 'hello', 'user')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('user')
})

test('handleInput should mark script input source', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'composer', 'hello', 'script')
  expect(result.composerValue).toBe('hello')
  expect(result.inputSource).toBe('script')
})

test('handleInput should cap composer height based on maxComposerRows', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'open-router-api-key', 'or-key-abc')
  expect(result.openRouterApiKeyInput).toBe('or-key-abc')
  expect(result.composerValue).toBe('')
})

test('handleInput should update openApiApiKeyInput when editing openapi api key input', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'open-api-api-key', 'oa-key-abc')
  expect(result.openApiApiKeyInput).toBe('oa-key-abc')
  expect(result.composerValue).toBe('')
})

test('handleInput should update searchValue when editing search input', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'search', 'dummy')
  expect(result.searchValue).toBe('dummy')
})

test('handleInput should update modelPickerSearchValue when editing model picker search input', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = createDefaultState()
  const result = await HandleInput.handleInput(state, 'model-picker-search', 'gpt')
  expect(result.modelPickerSearchValue).toBe('gpt')
  expect(result.visibleModels).toEqual(getVisibleModels(state.models, 'gpt'))
})
