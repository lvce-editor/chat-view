import { expect, test } from '@jest/globals'
import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleInput, type HandleInputState } from '../src/parts/HandleInput/HandleInput.ts'
import { getState } from '../src/parts/ModelState/ModelState.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

const Composer = 'composer'
const Search = 'search'
const ModelPickerSearch = 'model-picker-search'
const OpenApiApiKeyInput = 'open-api-api-key'
const OpenRouterApiKeyInput = 'open-router-api-key'

const createState = (overrides: Partial<HandleInputState> = {}): HandleInputState => {
  return {
    chatInputHistory: [],
    chatInputHistoryDraft: '',
    chatInputHistoryIndex: -1,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    composerFontFamily: 'system-ui',
    composerFontSize: 13,
    composerHeight: 28,
    composerLineHeight: 20,
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    focus: 'composer',
    focused: true,
    inputSource: 'user',
    lastSubmittedSessionId: '',
    maxComposerRows: 5,
    modelPickerHeaderHeight: 40,
    modelPickerHeight: 120,
    modelPickerListScrollTop: 0,
    modelPickerSearchValue: '',
    models: [
      { id: 'test', name: 'Test Model' },
      { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' },
      { id: 'openrouter/codex-mini', name: 'Codex Mini', provider: 'openRouter' },
    ],
    openApiApiKey: '',
    openApiApiKeyInput: '',
    openRouterApiKeyInput: '',
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    searchValue: '',
    selectedModelId: 'test',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    systemPrompt: '',
    uid: 1,
    viewMode: 'detail',
    visibleModels: [
      { id: 'test', name: 'Test Model' },
      { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' },
      { id: 'openrouter/codex-mini', name: 'Codex Mini', provider: 'openRouter' },
    ],
    width: 400,
    ...overrides,
  }
}

test.skip('handleInput should update composer value and persist state in the model', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 44,
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState()

  const result = await handleInput(state, Composer, 'hello', 'user')

  expect(result.composerValue).toBe('hello')
  expect(result.composerSelectionStart).toBe(5)
  expect(result.composerSelectionEnd).toBe(5)
  expect(result.chatInputHistoryDraft).toBe('hello')
  expect(result.inputSource).toBe('user')
  expect(getState(state.uid)).toEqual(result)
  expect(mockRendererRpc.invocations).toContainEqual(['Chat.rerenderWithQuery', state.uid])
})

test.skip('handleInput should mark script input source', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 44,
  })
  expect(mockRendererRpc).toBeDefined()

  const result = await handleInput(createState(), Composer, 'hello', 'script')

  expect(result.inputSource).toBe('script')
})

test.skip('handleInput should keep history draft while browsing history', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 44,
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState({
    chatInputHistory: ['first', 'second'],
    chatInputHistoryDraft: 'my unsent draft',
    chatInputHistoryIndex: 0,
  })

  const result = await handleInput(state, Composer, 'second edited')

  expect(result.chatInputHistoryDraft).toBe('my unsent draft')
})

test.skip('handleInput should cap composer height based on maxComposerRows', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 999,
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState({
    composerLineHeight: 20,
    maxComposerRows: 3,
  })
  const value = Array.from({ length: 100 }).fill('line').join('\n')

  const result = await handleInput(state, Composer, value)

  expect(result.composerHeight).toBe(68)
})

test.skip('handleInput should update openRouterApiKeyInput when editing api key textarea', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()

  const result = await handleInput(createState(), OpenRouterApiKeyInput, 'or-key-abc')

  expect(result.openRouterApiKeyInput).toBe('or-key-abc')
  expect(result.composerValue).toBe('')
})

test.skip('handleInput should update openApiApiKeyInput when editing openapi api key input', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()

  const result = await handleInput(createState(), OpenApiApiKeyInput, 'oa-key-abc')

  expect(result.openApiApiKeyInput).toBe('oa-key-abc')
  expect(result.composerValue).toBe('')
})

test.skip('handleInput should update searchValue when editing search input', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()

  const result = await handleInput(createState(), Search, 'dummy')

  expect(result.searchValue).toBe('dummy')
})

test.skip('handleInput should update modelPickerSearchValue when editing model picker search input', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState()

  const result = await handleInput(state, ModelPickerSearch, 'gpt')

  expect(result.modelPickerSearchValue).toBe('gpt')
  expect(result.visibleModels).toEqual([{ id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' }])
})

test.skip('handleInput should keep selected model when it remains visible after filtering', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState({
    selectedModelId: 'openapi/gpt-4.1-mini',
  })

  const result = await handleInput(state, ModelPickerSearch, 'gpt')

  expect(result.selectedModelId).toBe('openapi/gpt-4.1-mini')
})

test.skip('handleInput should select the first visible model when filtering hides the current selection', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState({
    selectedModelId: 'openapi/gpt-4.1-mini',
  })

  const result = await handleInput(state, ModelPickerSearch, 'codex')

  expect(result.visibleModels).toEqual([{ id: 'openrouter/codex-mini', name: 'Codex Mini', provider: 'openRouter' }])
  expect(result.selectedModelId).toBe('openrouter/codex-mini')
})

test.skip('handleInput should append a handle-input event for composer changes', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 44,
  })
  expect(mockRendererRpc).toBeDefined()
  const state = createState({
    selectedSessionId: 'session-9',
  })

  await handleInput(state, Composer, 'hello')

  const events = (await ChatStorageWorker.invoke('ChatStorage.getEvents', 'session-9')) as readonly {
    readonly type: string
    readonly value?: string
  }[]
  expect(events).toHaveLength(1)
  expect(events[0]).toMatchObject({
    type: 'handle-input',
    value: 'hello',
  })
})
