// cspell:ignore openrouter worktrees
import { expect, test } from '@jest/globals'
import { ExtensionHost, OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { getChatViewEvents } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getNextAutoScrollTop } from '../src/parts/GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

test('handleClick should create a new session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'create-session')
  expect(result.sessions).toHaveLength(2)
  expect(result.selectedSessionId).toBe(result.sessions[1].id)
  expect(result.sessions[1].id).toMatch(uuidRegex)
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
})

test('handleClick should create a new session in the selected project from project action button', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    projectExpandedIds: ['project-1'],
    projects: [
      { id: 'project-1', name: '_blank', uri: '' },
      { id: 'project-2', name: 'Current Workspace', uri: '/workspace' },
    ],
    selectedProjectId: 'project-1',
  }
  const result = await HandleClick.handleClick(state, 'create-session-in-project:project-2')
  expect(result.sessions).toHaveLength(2)
  expect(result.selectedProjectId).toBe('project-2')
  expect(result.sessions[1].projectId).toBe('project-2')
  expect(result.projectExpandedIds).toEqual(['project-1', 'project-2'])
  expect(result.selectedSessionId).toBe(result.sessions[1].id)
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
})

test('handleClick should keep chat-focus mode and focus composer when creating a new session from the focus sidebar', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    lastNormalViewMode: 'detail',
    projectExpandedIds: ['project-1'],
    viewMode: 'chat-focus',
  }
  const result = await HandleClick.handleClick(state, 'create-session-in-project:project-1')
  expect(result.sessions).toHaveLength(2)
  expect(result.viewMode).toBe('chat-focus')
  expect(result.lastNormalViewMode).toBe('detail')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
})

test('handleClick should select a session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'session:session-2')
  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
})

test('handleClick should switch from normal mode to chat-focus mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'toggle-chat-focus')
  expect(result.viewMode).toBe('chat-focus')
  expect(result.lastNormalViewMode).toBe('detail')
})

test('handleClick should switch from chat-focus mode back to remembered normal mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    lastNormalViewMode: 'detail',
    viewMode: 'chat-focus',
  }
  const result = await HandleClick.handleClick(state, 'toggle-chat-focus')
  expect(result.viewMode).toBe('detail')
})

test('handleClick should toggle search field visibility on', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    searchEnabled: true,
    searchFieldVisible: false,
  }
  const result = await HandleClick.handleClick(state, 'toggle-search')
  expect(result.searchFieldVisible).toBe(true)
})

test('handleClick should clear search value when toggling search field visibility off', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    searchEnabled: true,
    searchFieldVisible: true,
    searchValue: 'hello',
  }
  const result = await HandleClick.handleClick(state, 'toggle-search')
  expect(result.searchFieldVisible).toBe(false)
  expect(result.searchValue).toBe('')
})

test('handleClick should mark session for rename and prefill composer', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session-rename:session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.composerValue).toBe('Chat 1')
})

test('handleClick should delete a session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'SessionDelete', 'session-2')
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-1')
  expect(result.selectedSessionId).toBe('session-1')
})

test('handleClick should delete a project and move its sessions to the blank project', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    projectExpandedIds: ['project-1', 'project-2'],
    projects: [
      { id: 'project-1', name: '_blank', uri: '' },
      { id: 'project-2', name: 'workspace', uri: 'file:///workspace' },
    ],
    selectedProjectId: 'project-2',
    selectedSessionId: 'session-2',
    sessions: [
      { id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' },
      { id: 'session-2', messages: [], projectId: 'project-2', title: 'Chat 2' },
    ],
    viewMode: 'chat-focus',
  }
  const result = await HandleClick.handleClick(state, InputName.ProjectDelete, 'project-2')
  expect(result.projects).toEqual([{ id: 'project-1', name: '_blank', uri: '' }])
  expect(result.selectedProjectId).toBe('project-1')
  expect(result.selectedSessionId).toBe('session-2')
  expect(result.projectExpandedIds).toEqual(['project-1'])
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' },
    { id: 'session-2', messages: [], projectId: 'project-1', title: 'Chat 2' },
  ])
  expect(result.viewMode).toBe('chat-focus')
})

test('handleClick should ignore deleting the blank project', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, InputName.ProjectDelete, 'project-1')
  expect(result).toBe(state)
})

test('handleClick should ignore empty action name', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should ignore selecting unknown session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session:missing')
  expect(result).toBe(state)
})

test('handleClick should allow deleting last session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    renamingSessionId: 'session-1',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'SessionDelete', 'session-1')
  expect(result.sessions).toHaveLength(0)
  expect(result.selectedSessionId).toBe('')
  expect(result.renamingSessionId).toBe('')
  expect(result.viewMode).toBe('list')
})

test('handleClick should keep state for unknown action', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'unknown-action')
  expect(result).toBe(state)
})

test('handleClick should scroll messages to bottom when clicking scroll down button', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    messagesAutoScrollEnabled: false,
    messagesScrollTop: 120,
  }
  const result = await HandleClick.handleClick(state, InputName.ScrollDown)
  expect(result.messagesAutoScrollEnabled).toBe(true)
  expect(result.messagesScrollTop).toBe(getNextAutoScrollTop(120))
})

test('handleClick should remove composer attachment and persist removal event', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    composerAttachments: [
      { attachmentId: 'attachment-1', displayType: 'image', mimeType: 'image/svg+xml', name: 'photo.svg', size: 1 },
      { attachmentId: 'attachment-2', displayType: 'text-file', mimeType: 'text/plain', name: 'notes.txt', size: 5 },
    ],
    selectedSessionId: 'session-1',
  }
  const result = await HandleClick.handleClick(state, InputName.getComposerAttachmentRemoveInputName('attachment-1'))
  expect(result.composerAttachments).toEqual([
    { attachmentId: 'attachment-2', displayType: 'text-file', mimeType: 'text/plain', name: 'notes.txt', size: 5 },
  ])
  const events = await getChatViewEvents('session-1')
  expect(events.at(-1)).toMatchObject({
    attachmentId: 'attachment-1',
    sessionId: 'session-1',
    type: 'chat-attachment-removed',
  })
})

test('handleClick should toggle run mode picker open', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    runModePickerOpen: false,
  }
  const result = await HandleClick.handleClick(state, 'run-mode-picker-toggle')
  expect(result.runModePickerOpen).toBe(true)
})

test('handleClick should select run mode from picker item and close picker', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    runMode: 'local',
    runModePickerOpen: true,
  }
  const result = await HandleClick.handleClick(state, 'run-mode-picker-item:background')
  expect(result.runMode).toBe('background')
  expect(result.runModePickerOpen).toBe(false)
})

test('handleClick should select model from model picker item and close picker', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
    selectedModelId: 'test',
  }
  const result = await HandleClick.handleClick(state, 'model-picker-item:openapi/gpt-4.1-mini')
  expect(result.selectedModelId).toBe('openapi/gpt-4.1-mini')
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.visibleModels).toBe(result.models)
})

// eslint-disable-next-line jest/no-disabled-tests
test.skip('handleClick should select model from delegated model picker list click using y coordinate', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    height: 400,
    modelPickerOpen: true,
    modelPickerSearchValue: '',
    models: [
      { id: 'test', name: 'Test' },
      { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini' },
      { id: 'codex-5.3', name: 'Codex 5.3' },
    ],
    selectedModelId: 'test',
    visibleModels: [{ id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini' }],
    y: 20,
  }
  const result = await HandleClick.handleClick(state, 'model-picker-list', '', 10, 340)
  expect(result.selectedModelId).toBe('openapi/gpt-4.1-mini')
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.visibleModels).toBe(result.models)
})

test('handleClick should login via auth bridge and persist backend access token', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Auth.login': async () => {
      return {
        accessToken: 'backend-token-1',
        refreshToken: 'backend-refresh-token-1',
        subscriptionPlan: 'pro',
        usedTokens: 321,
        userName: 'test',
      }
    },
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    authEnabled: true,
    backendUrl: 'https://backend.example.com',
  }
  const result = await HandleClick.handleClick(state, 'login')
  expect(result.authAccessToken).toBe('backend-token-1')
  expect(result.authRefreshToken).toBe('backend-refresh-token-1')
  expect(result.authStatus).toBe('signed-in')
  expect(result.userName).toBe('test')
  expect(result.userSubscriptionPlan).toBe('pro')
  expect(result.userUsedTokens).toBe(321)
  expect(mockRpc.invocations).toEqual([
    ['Auth.login', 'https://backend.example.com'],
    [
      'Preferences.update',
      {
        'secrets.chatBackendAccessToken': 'backend-token-1',
        'secrets.chatBackendRefreshToken': 'backend-refresh-token-1',
      },
    ],
  ])
})

test('handleClick should logout and clear persisted backend access token', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Auth.logout': async () => {},
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    authAccessToken: 'backend-token-1',
    authEnabled: true,
    authRefreshToken: 'backend-refresh-token-1',
    authStatus: 'signed-in',
    backendUrl: 'https://backend.example.com',
    userName: 'test',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 321,
  }
  const result = await HandleClick.handleClick(state, 'logout')
  expect(result.authAccessToken).toBe('')
  expect(result.authRefreshToken).toBe('')
  expect(result.authStatus).toBe('signed-out')
  expect(result.userName).toBe('')
  expect(result.userSubscriptionPlan).toBe('')
  expect(result.userUsedTokens).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['Auth.logout', 'https://backend.example.com'],
    ['Preferences.update', { 'secrets.chatBackendAccessToken': '', 'secrets.chatBackendRefreshToken': '' }],
  ])
})

test('handleClick should submit message when clicking send', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'send')
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClickSend should submit message', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClickSend(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClickSend should create a new session from list mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    lastNormalViewMode: 'detail',
    viewMode: 'list',
  }

  const result = await HandleClick.handleClickSend(state)

  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(newSession?.id).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(newSession?.messages[0]?.text).toBe('hello')
  expect(result.viewMode).toBe('detail')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClick should save openrouter api key to user settings', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    openRouterApiKeyInput: 'or-key-999',
  }
  const result = await HandleClick.handleClick(state, 'save-openrouter-api-key')
  expect(result.openRouterApiKey).toBe('or-key-999')
  expect(mockRpc.invocations).toEqual([['Chat.rerender'], ['Preferences.update', { 'secrets.openRouterApiKey': 'or-key-999' }]])
})

test('handleClick should retry previous prompt after saving openrouter api key', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'Preferences.update': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Recovered OpenRouter response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state: ChatState = {
      ...createDefaultState(),
      nextMessageId: 3,
      openRouterApiKeyInput: 'or-key-999',
      selectedModelId: 'claude-code',
      selectedSessionId: 'session-1',
      sessions: [
        {
          id: 'session-1',
          messages: [
            { id: 'message-1', role: 'user', text: 'hello from openrouter', time: '10:31' },
            {
              id: 'message-2',
              role: 'assistant',
              text: 'OpenRouter API key is not configured. Enter your OpenRouter API key below and click Save.',
              time: '10:32',
            },
          ],
          title: 'Chat 1',
        },
      ],
      viewMode: 'detail',
    }
    const result = await HandleClick.handleClick(state, 'save-openrouter-api-key')
    expect(result.openRouterApiKey).toBe('or-key-999')
    expect(result.nextMessageId).toBe(4)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('Recovered OpenRouter response')
    expect(mockRpc.invocations).toEqual([['Chat.rerender'], ['Preferences.update', { 'secrets.openRouterApiKey': 'or-key-999' }]])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleClick should open OpenRouter API keys settings', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openrouter-api-key-settings')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.openUri', 'app://settings.json']])
})

test('handleClick should open OpenRouter API keys website', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openrouter-api-key-website')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Open.openExternal', 'https://openrouter.ai/settings/keys']])
})

test('handleClick should save openapi api key to user settings', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    openApiApiKeyInput: 'oa-key-999',
  }
  const result = await HandleClick.handleClick(state, 'save-openapi-api-key')
  expect(result.openApiApiKey).toBe('oa-key-999')
  expect(mockRpc.invocations).toEqual([['Chat.rerender'], ['Preferences.update', { 'secrets.openApiKey': 'oa-key-999' }]])
})

test('handleClick should retry previous prompt after saving openapi api key', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'Preferences.update': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Recovered OpenAI response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state: ChatState = {
      ...createDefaultState(),
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 3,
      openApiApiKeyInput: 'oa-key-999',
      selectedModelId: 'openapi/gpt-4o-mini',
      selectedSessionId: 'session-1',
      sessions: [
        {
          id: 'session-1',
          messages: [
            { id: 'message-1', role: 'user', text: 'hello from openapi', time: '10:31' },
            {
              id: 'message-2',
              role: 'assistant',
              text: 'OpenAI API key is not configured. Enter your OpenAI API key below and click Save.',
              time: '10:32',
            },
          ],
          title: 'Chat 1',
        },
      ],
      streamingEnabled: false,
      viewMode: 'detail',
    }
    const result = await HandleClick.handleClick(state, 'save-openapi-api-key')
    expect(result.openApiApiKey).toBe('oa-key-999')
    expect(result.nextMessageId).toBe(4)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('Recovered OpenAI response')
    expect(mockRpc.invocations).toEqual([['Chat.rerender'], ['Preferences.update', { 'secrets.openApiKey': 'oa-key-999' }]])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleClick should open OpenAPI API keys settings', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openapi-api-key-settings')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.openUri', 'app://settings.json']])
})

test('handleClick should open OpenAPI API keys website', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openapi-api-key-website')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Open.openExternal', 'https://platform.openai.com/api-keys']])
})

test('handleClick should create pull request for completed background session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Main.openUri': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (id: string, payload: any) => {
      expect(id).toBe('Chat.createPullRequest')
      expect(payload).toEqual({
        branchName: 'chat/session-1',
        title: 'Chat 1',
        workspaceUri: 'file:///workspace/app.worktrees/chat-session-1',
      })
      return {
        pullRequestUrl: 'https://github.com/lvce-editor/chat-view/pull/123',
      }
    },
  })
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [
      {
        branchName: 'chat/session-1',
        id: 'session-1',
        messages: [
          { id: 'message-1', role: 'user', text: 'hello', time: '10:00' },
          { id: 'message-2', role: 'assistant', text: 'done', time: '10:01' },
        ],
        projectId: 'project-1',
        title: 'Chat 1',
        workspaceUri: 'file:///workspace/app.worktrees/chat-session-1',
      },
    ],
  }
  const result = await HandleClick.handleClick(state, 'create-pull-request')
  expect(result.sessions[0].pullRequestUrl).toBe('https://github.com/lvce-editor/chat-view/pull/123')
  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', 'onCommand:Chat.createPullRequest', '', 0],
    ['Main.openUri', 'https://github.com/lvce-editor/chat-view/pull/123'],
  ])
  expect(mockExtensionHostRpc.invocations).toHaveLength(1)
})

test('handleClickList should open detail for session index from y coordinate', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    height: 400,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
      { id: 'session-3', messages: [], title: 'Chat 3' },
    ],
    width: 200,
    x: 0,
    y: 0,
  }
  const result = await HandleClick.handleClickList(state, 8, 131)
  expect(result.selectedSessionId).toBe('session-3')
  expect(result.viewMode).toBe('detail')
})

test('handleClickList should keep state when click index has no session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    height: 120,
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    width: 100,
    x: 10,
    y: 20,
  }
  const result = await HandleClick.handleClickList(state, 10, 120)
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
  })
})

test('handleClickList should ignore clicks in header area', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    height: 300,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 300,
    x: 100,
    y: 200,
  }
  const result = await HandleClick.handleClickList(state, 120, 220)
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
  })
})

test('handleClickList should ignore clicks outside chat bounds', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    height: 300,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 300,
    x: 100,
    y: 200,
  }
  const result = await HandleClick.handleClickList(state, 99, 250)
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
  })
})
