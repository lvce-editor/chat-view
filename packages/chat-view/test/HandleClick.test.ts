// cspell:ignore openrouter
import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { resetChatSessionStorage } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

beforeEach(() => {
  resetChatSessionStorage()
})

test('handleClick should create a new session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'create-session')
  expect(result.sessions).toHaveLength(2)
  expect(result.selectedSessionId).toBe(result.sessions[1].id)
  expect(result.sessions[1].id).toMatch(uuidRegex)
})

test('handleClick should create a new session in the selected project from project action button', async () => {
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
})

test('handleClick should select a session', async () => {
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
  const state: ChatState = {
    ...createDefaultState(),
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'toggle-chat-focus')
  expect(result.viewMode).toBe('chat-focus')
  expect(result.lastNormalViewMode).toBe('detail')
})

test('handleClick should switch from chat-focus mode back to remembered normal mode', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    lastNormalViewMode: 'detail',
    viewMode: 'chat-focus',
  }
  const result = await HandleClick.handleClick(state, 'toggle-chat-focus')
  expect(result.viewMode).toBe('detail')
})

test('handleClick should toggle search field visibility on', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    searchEnabled: true,
    searchFieldVisible: false,
  }
  const result = await HandleClick.handleClick(state, 'toggle-search')
  expect(result.searchFieldVisible).toBe(true)
})

test('handleClick should clear search value when toggling search field visibility off', async () => {
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
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session-rename:session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.composerValue).toBe('Chat 1')
})

test('handleClick should delete a session', async () => {
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

test('handleClick should ignore empty action name', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should ignore selecting unknown session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session:missing')
  expect(result).toBe(state)
})

test('handleClick should allow deleting last session', async () => {
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
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'unknown-action')
  expect(result).toBe(state)
})

test('handleClick should login via auth bridge and persist backend access token', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Auth.login': async () => {
      return {
        accessToken: 'backend-token-1',
        refreshToken: 'backend-refresh-token-1',
        subscriptionPlan: 'pro',
        usedTokens: 321,
        userName: 'simon',
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
  expect(result.userName).toBe('simon')
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
    userName: 'simon',
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
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClick(state, 'send')
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClickSend should submit message', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClickSend(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClick should save openrouter api key to user settings', async () => {
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
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openrouter-api-key-settings')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.openUri', 'app://settings.json']])
})

test('handleClick should open OpenRouter API keys website', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openrouter-api-key-website')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Open.openExternal', 'https://openrouter.ai/settings/keys']])
})

test('handleClick should save openapi api key to user settings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    openApiApiKeyInput: 'oa-key-999',
  }
  const result = await HandleClick.handleClick(state, 'save-openapi-api-key')
  expect(result.openApiApiKey).toBe('oa-key-999')
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'secrets.openApiKey': 'oa-key-999' }]])
})

test('handleClick should retry previous prompt after saving openapi api key', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
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
    expect(mockRpc.invocations).toEqual([['Preferences.update', { 'secrets.openApiKey': 'oa-key-999' }]])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleClick should open OpenAPI API keys settings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openapi-api-key-settings')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.openUri', 'app://settings.json']])
})

test('handleClick should open OpenAPI API keys website', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openapi-api-key-website')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Open.openExternal', 'https://platform.openai.com/api-keys']])
})

test('handleClickList should open detail for session index from y coordinate', async () => {
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
  const state: ChatState = {
    ...createDefaultState(),
    height: 120,
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    width: 100,
    x: 10,
    y: 20,
  }
  const result = await HandleClick.handleClickList(state, 10, 120)
  expect(result).toBe(state)
})

test('handleClickList should ignore clicks in header area', async () => {
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
  expect(result).toBe(state)
})

test('handleClickList should ignore clicks outside chat bounds', async () => {
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
  expect(result).toBe(state)
})
