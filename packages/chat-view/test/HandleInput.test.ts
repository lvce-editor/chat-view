import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getVisibleModels } from '../src/parts/GetVisibleModels/GetVisibleModels.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import { OpenApiApiKeyInput } from '../src/parts/OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenRouterApiKeyInput } from '../src/parts/OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

const models = [
  { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' as const },
  { id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const },
  { id: 'openapi/codex-5.3', name: 'Codex 5.3', provider: 'openApi' as const },
] as const

function createState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    ...createDefaultState(),
    models,
    visibleModels: models,
    ...overrides,
  }
}

async function invokeHandleInput(state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  void mockChatStorageRpc
  return await HandleInput.handleInput(state, name, value, inputSource)
}

test('handleInput should update composer value', async () => {
  const result = await invokeHandleInput(createState(), InputName.Composer, 'hello', 'user')
  expect(result.composerValue).toBe('hello')
  expect(result.composerSelectionStart).toBe(5)
  expect(result.composerSelectionEnd).toBe(5)
  expect(result.inputSource).toBe('user')
})

test('handleInput should mark script input source', async () => {
  const result = await invokeHandleInput(createState(), InputName.Composer, 'hello', 'script')
  expect(result.composerValue).toBe('hello')
  expect(result.composerSelectionStart).toBe(5)
  expect(result.composerSelectionEnd).toBe(5)
  expect(result.inputSource).toBe('script')
})

test('handleInput should update history draft when not browsing history', async () => {
  const result = await invokeHandleInput(createState(), InputName.Composer, 'draft text')
  expect(result.chatInputHistoryDraft).toBe('draft text')
})

test('handleInput should keep history draft while browsing history', async () => {
  const state = createState({
    chatInputHistory: ['first', 'second'],
    chatInputHistoryDraft: 'my unsent draft',
    chatInputHistoryIndex: 0,
  })
  const result = await invokeHandleInput(state, InputName.Composer, 'second edited')
  expect(result.chatInputHistoryDraft).toBe('my unsent draft')
})

test('handleInput should cap composer height based on maxComposerRows', async () => {
  const state = createState({
    composerLineHeight: 20,
    maxComposerRows: 3,
    width: 400,
  })
  const value = Array.from({ length: 100 }).fill('line').join('\n')
  const result = await invokeHandleInput(state, InputName.Composer, value)
  expect(result.composerHeight).toBe(68)
})

test('handleInput should update openRouterApiKeyInput when editing api key textarea', async () => {
  const result = await invokeHandleInput(createState(), OpenRouterApiKeyInput, 'or-key-abc')
  expect(result.openRouterApiKeyInput).toBe('or-key-abc')
  expect(result.composerValue).toBe('')
})

test('handleInput should update openApiApiKeyInput when editing openapi api key input', async () => {
  const result = await invokeHandleInput(createState(), OpenApiApiKeyInput, 'oa-key-abc')
  expect(result.openApiApiKeyInput).toBe('oa-key-abc')
  expect(result.composerValue).toBe('')
})

test('handleInput should update searchValue when editing search input', async () => {
  const result = await invokeHandleInput(createState(), InputName.Search, 'dummy')
  expect(result.searchValue).toBe('dummy')
})

test('handleInput should update modelPickerSearchValue when editing model picker search input', async () => {
  const state = createState()
  const result = await invokeHandleInput(state, InputName.ModelPickerSearch, 'gpt')
  expect(result.modelPickerSearchValue).toBe('gpt')
  expect(result.visibleModels).toEqual(getVisibleModels(state.models, 'gpt'))
})

test('handleInput should keep selected model when it remains visible after filtering', async () => {
  const state = createState({
    selectedModelId: 'openapi/gpt-4.1-mini',
  })
  const result = await invokeHandleInput(state, InputName.ModelPickerSearch, 'gpt')
  expect(result.selectedModelId).toBe('openapi/gpt-4.1-mini')
})

test('handleInput should select the first visible model when filtering hides the current selection', async () => {
  const state = createState({
    selectedModelId: 'openapi/gpt-4.1-mini',
  })
  const visibleModels = getVisibleModels(state.models, 'codex')
  const result = await invokeHandleInput(state, InputName.ModelPickerSearch, 'codex')
  expect(visibleModels.length).toBeGreaterThan(0)
  expect(result.visibleModels).toEqual(visibleModels)
  expect(result.selectedModelId).toBe(visibleModels[0].id)
})
