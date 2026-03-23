// cspell:ignore openrouter
import { expect, test } from '@jest/globals'
import { ChatToolWorker, ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import { registerSlashCommands } from '../src/parts/Listen/Listen.ts'
import { getChatViewEvents } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

registerSlashCommands()

test('handleSubmit should add a user message from composer value', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
})

test('handleSubmit should use OpenRouter response for openRouter models', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
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

test('handleSubmit should use OpenAPI response for openApi models', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Real OpenAI response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from openapi',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: false,
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('Real OpenAI response')
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should not fall back to mock response for openApi models when api key is missing', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = {
    ...createDefaultState(),
    composerValue: 'hello from openapi',
    models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
    openApiApiKey: '',
    selectedModelId: 'openapi/gpt-4o-mini',
    viewMode: 'detail' as const,
  }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('OpenAI API key is not configured. Enter your OpenAI API key below and click Save.')
  expect(result.sessions[0].messages[1].text).not.toContain('Mock AI response:')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should include OpenRouter limit reset and usage details in 429 message when available', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: unknown) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input instanceof Request ? input.url : ''
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

test('handleSubmit should update assistant message incrementally when streaming is enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    const chunks = [
      'data: {"type":"response.output_text.delta","delta":"Stream"}\n\n',
      'data: {"type":"response.output_text.delta","delta":"ing"}\n\n',
      'data: {"type":"response.completed"}\n\n',
      'data: [DONE]\n\n',
    ]
    let index = 0
    return {
      body: {
        getReader: () => ({
          read: async (): Promise<ReadableStreamReadResult<Uint8Array>> => {
            if (index >= chunks.length) {
              return { done: true, value: undefined }
            }
            const value = new TextEncoder().encode(chunks[index++])
            return { done: false, value }
          },
        }),
      },
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'hello from streaming',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].role).toBe('assistant')
    expect(result.sessions[0].messages[1].text).toBe('Streaming')
    expect(result.sessions[0].messages[1].inProgress).toBe(false)
    expect(mockRpc.invocations).toEqual([['Chat.rerender'], ['Chat.rerender'], ['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should suppress streaming function call data events by default', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () =>
      JSON.stringify({
        error: 'File not found: index.html',
        errorStack: "TypeError: Cannot read properties of undefined (reading 'invoke')\n    at test:1:1",
      }),
  })
  const originalFetch = globalThis.fetch
  let requestIndex = 0
  globalThis.fetch = (async () => {
    const chunks =
      requestIndex === 0
        ? [
            'data: {"type":"response.output_item.added","output_index":0,"item":{"type":"function_call","call_id":"call_1","name":"read_file","arguments":""}}\n\n',
            'data: {"type":"response.function_call_arguments.delta","output_index":0,"delta":"{\\"path\\":\\"index.html\\"}"}\n\n',
            'data: {"type":"response.completed"}\n\n',
            'data: [DONE]\n\n',
          ]
        : ['data: {"type":"response.output_text.delta","delta":"Done"}\n\n', 'data: {"type":"response.completed"}\n\n', 'data: [DONE]\n\n']
    requestIndex++
    let index = 0
    return {
      body: {
        getReader: () => ({
          read: async (): Promise<ReadableStreamReadResult<Uint8Array>> => {
            if (index >= chunks.length) {
              return { done: true, value: undefined }
            }
            const value = new TextEncoder().encode(chunks[index++])
            return { done: false, value }
          },
        }),
      },
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'read index.html',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    const events = await getChatViewEvents(result.selectedSessionId)
    const dataEvents = events.filter((event) => event.type === 'sse-response-part')
    const responseCompletedEvents = events.filter((event) => event.type === 'sse-response-completed')
    const finishedEvent = events.find((event) => event.type === 'event-stream-finished')

    expect(dataEvents).toHaveLength(1)
    expect(responseCompletedEvents).toHaveLength(2)
    expect(responseCompletedEvents[0]).toMatchObject({
      type: 'sse-response-completed',
      value: {
        type: 'response.completed',
      },
    })
    expect(dataEvents[0]).toMatchObject({
      type: 'sse-response-part',
      value: {
        delta: 'Done',
        type: 'response.output_text.delta',
      },
    })
    expect(responseCompletedEvents[1]).toMatchObject({
      type: 'sse-response-completed',
      value: {
        type: 'response.completed',
      },
    })
    expect(finishedEvent).toMatchObject({
      type: 'event-stream-finished',
      value: '[DONE]',
    })
    expect(result.sessions[0].messages[1].toolCalls).toEqual([
      {
        arguments: '{"path":"index.html"}',
        errorStack: expect.any(String),
        id: 'call_1',
        name: 'read_file',
        status: 'not-found',
      },
    ])
    expect(mockRpc.invocations.length).toBeGreaterThanOrEqual(2)
    expect(mockChatToolRpc.invocations).toContainEqual(['ChatTool.execute', 'read_file', '{"path":"index.html"}', { assetDir: '', platform: 0 }])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should emit streaming function call data events when enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () =>
      JSON.stringify({
        error: 'File not found: index.html',
      }),
  })
  const originalFetch = globalThis.fetch
  let requestIndex = 0
  globalThis.fetch = (async () => {
    const chunks =
      requestIndex === 0
        ? [
            'data: {"type":"response.output_item.added","output_index":0,"item":{"type":"function_call","call_id":"call_1","name":"read_file","arguments":""}}\n\n',
            'data: {"type":"response.function_call_arguments.delta","output_index":0,"delta":"{\\"path\\":\\"index.html\\"}"}\n\n',
            'data: {"type":"response.completed"}\n\n',
            'data: [DONE]\n\n',
          ]
        : ['data: {"type":"response.output_text.delta","delta":"Done"}\n\n', 'data: {"type":"response.completed"}\n\n', 'data: [DONE]\n\n']
    requestIndex++
    let index = 0
    return {
      body: {
        getReader: () => ({
          read: async (): Promise<ReadableStreamReadResult<Uint8Array>> => {
            if (index >= chunks.length) {
              return { done: true, value: undefined }
            }
            const value = new TextEncoder().encode(chunks[index++])
            return { done: false, value }
          },
        }),
      },
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'read index.html',
      emitStreamingFunctionCallEvents: true,
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      viewMode: 'detail' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    const events = await getChatViewEvents(result.selectedSessionId)
    const dataEvents = events.filter((event) => event.type === 'sse-response-part')
    const responseCompletedEvents = events.filter((event) => event.type === 'sse-response-completed')

    expect(dataEvents).toHaveLength(3)
    expect(responseCompletedEvents).toHaveLength(2)
    expect(mockRpc.invocations.length).toBeGreaterThanOrEqual(2)
    expect(mockChatToolRpc.invocations).toContainEqual(['ChatTool.execute', 'read_file', '{"path":"index.html"}', { assetDir: '', platform: 0 }])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should clear selected session messages for /clear', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: '/clear',
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: 'message-1',
            role: 'user' as const,
            text: 'hello',
            time: '10:00',
          },
          {
            id: 'message-2',
            role: 'assistant' as const,
            text: 'hi',
            time: '10:01',
          },
        ],
        title: 'Chat 1',
      },
    ],
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toEqual([])
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
})

test('handleSubmit should create a new session for /new', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: '/new',
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions.length).toBe(state.sessions.length + 1)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(result.viewMode).toBe('detail')
  expect(result.composerValue).toBe('')
})

test('handleSubmit should append help response for /help', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: '/help',
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)
  const lastMessage = result.sessions[0].messages.at(-1)
  expect(lastMessage?.role).toBe('assistant')
  expect(lastMessage?.text).toContain('Available commands:')
  expect(lastMessage?.text).toContain('/new - Create and switch to a new chat session.')
})

test('handleSubmit should append markdown export for /export', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: '/export',
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: 'message-1',
            role: 'user' as const,
            text: 'hello',
            time: '10:00',
          },
        ],
        title: 'Chat 1',
      },
    ],
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)
  const lastMessage = result.sessions[0].messages.at(-1)
  expect(lastMessage?.role).toBe('assistant')
  expect(lastMessage?.text).toContain('```md')
  expect(lastMessage?.text).toContain('# Chat 1')
  expect(lastMessage?.text).toContain('## User')
})

test('handleSubmit should inject mentioned file context into ai request messages', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'ExtensionHostManagement.activateByEvent': async () => {},
    'FileSystem.readFile': async () => 'const value = 1',
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (_id: string, payload: any) => {
      expect(payload.messages).toHaveLength(2)
      expect(payload.messages[1].text).toContain('Referenced file context:')
      expect(payload.messages[1].text).toContain('File: src/main.ts')
      return {
        text: 'Mocked OpenRouter response from command',
        type: 'success',
      }
    },
  })

  const state = {
    ...createDefaultState(),
    composerValue: 'check @src/main.ts',
    mockApiCommandId: 'ChatE2e.mockApi',
    models: [{ id: 'openrouter/model', name: 'OpenRouter Model', provider: 'openRouter' as const }],
    selectedModelId: 'openrouter/model',
    useMockApi: true,
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(mockRendererRpc.invocations).toContainEqual(['FileSystem.readFile', 'src/main.ts'])
  expect(mockExtensionHostRpc.invocations).toHaveLength(1)
})

test('handleSubmit should generate ai session title for new session when enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  let requestIndex = 0
  globalThis.fetch = (async () => {
    requestIndex += 1
    if (requestIndex === 1) {
      return {
        json: async () => ({ choices: [{ message: { content: 'Assistant answer' } }] }),
        ok: true,
        status: 200,
      } as Response
    }
    return {
      json: async () => ({ choices: [{ message: { content: 'TypeScript parser bug fix' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const state = {
      ...createDefaultState(),
      aiSessionTitleGenerationEnabled: true,
      composerValue: 'help me fix a parser bug',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: false,
      viewMode: 'list' as const,
    }
    const result = await HandleSubmit.handleSubmit(state)
    const newSession = result.sessions.at(-1)
    expect(newSession).toBeDefined()
    expect(newSession?.title).toBe('TypeScript parser bug fix')
    expect(requestIndex).toBe(2)
    expect(mockRpc.invocations).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})
