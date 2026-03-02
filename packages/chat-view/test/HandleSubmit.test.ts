/* eslint-disable @cspell/spellchecker */
import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { resetChatSessionStorage } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

test('handleSubmit should add a user message from composer value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'hello', viewMode: 'detail' as const }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].role).toBe('user')
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('Mock AI response: I received "hello".')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should create a new session and switch to detail mode from list mode', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'first message', viewMode: 'list' as const }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(newSession).toBeDefined()
  expect(newSession?.id).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(result.viewMode).toBe('detail')
  expect(newSession?.messages).toHaveLength(2)
  expect(newSession?.messages[0].role).toBe('user')
  expect(newSession?.messages[0].text).toBe('first message')
  expect(newSession?.messages[1].role).toBe('assistant')
  expect(result.lastSubmittedSessionId).toBe(result.selectedSessionId)
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should ignore blank composer value', async () => {
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
})

test('handleSubmit should use OpenRouter response for openRouter models', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Real OpenRouter response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from openrouter',
      openRouterApiKey: 'or-key-123',
      selectedModelId: 'claude-code',
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('Real OpenRouter response')
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should not fall back to mock response for openRouter models when api key is missing', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = {
    ...createDefaultState(),
    composerValue: 'hello from openrouter',
    openRouterApiKey: '',
    selectedModelId: 'openRouter/meta-llama/llama-3.3-70b-instruct:free',
    viewMode: 'detail' as const,
  }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('OpenRouter API key is not configured. Enter your OpenRouter API key below and click Save.')
  expect(result.sessions[0].messages[1].text).not.toContain('Mock AI response:')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should not fall back to mock response for openRouter models when request fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    throw new Error('network failure')
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from openrouter',
      openRouterApiKey: 'or-key-123',
      selectedModelId: 'openrouter/meta-llama/llama-3.3-70b-instruct:free',
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('OpenRouter request failed. Possible reasons:')
    expect(result.sessions[0].messages[1].text).not.toContain('Mock AI response:')
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should show too many requests message for OpenRouter 429 responses', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      ok: false,
      status: 429,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from openrouter',
      openRouterApiKey: 'or-key-123',
      selectedModelId: 'openrouter/meta-llama/llama-3.3-70b-instruct:free',
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('OpenRouter rate limit reached (429). Please try again soon. Helpful tips:')
    expect(result.sessions[0].messages[1].text).not.toContain('Mock AI response:')
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should include OpenRouter limit reset and usage details in 429 message when available', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.endsWith('/chat/completions')) {
      return {
        headers: {
          get: (name: string) => (name === 'retry-after' ? '45' : null),
        },
        ok: false,
        status: 429,
      } as Response
    }
    return {
      json: async () => ({
        data: {
          limit_remaining: 3,
          limit_reset: 'daily',
          usage: 120,
          usage_daily: 9,
        },
      }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from openrouter',
      openRouterApiKey: 'or-key-123',
      selectedModelId: 'openrouter/meta-llama/llama-3.3-70b-instruct:free',
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toContain('OpenRouter rate limit reached (429). Please try again soon. Helpful tips:')
    expect(result.sessions[0].messages[1].text).toContain('Retry after: 45.')
    expect(result.sessions[0].messages[1].text).toContain('Limit resets: daily.')
    expect(result.sessions[0].messages[1].text).toContain('Credits remaining: 3.')
    expect(result.sessions[0].messages[1].text).toContain('Credits used today (UTC): 9.')
    expect(result.sessions[0].messages[1].text).toContain('Credits used (all time): 120.')
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})
