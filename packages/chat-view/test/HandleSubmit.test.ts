import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'
import { set } from '../src/parts/StatusBarStates/StatusBarStates.ts'

test.skip('handleSubmit should delegate to chat view model worker', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async (state: ChatState) => ({
      ...state,
      composerValue: '',
      selectedSessionId: 'session-2',
      sessions: [...state.sessions, { id: 'session-2', messages: [], projectId: state.selectedProjectId, status: 'idle', title: 'Chat 2' }],
      viewMode: 'detail',
    }),
  })
<<<<<<< HEAD
  const firstState = {
    ...createDefaultState(),
    chatInputHistory: ['hello'],
    composerValue: 'hello',
    viewMode: 'detail' as const,
  }
  const first = await HandleSubmit.handleSubmit(firstState)
  expect(first.chatInputHistory).toEqual(['hello'])
  expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  expect(newSession?.status).toBe('finished')
  expect(result.lastSubmittedSessionId).toBe(result.selectedSessionId)
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  globalThis.fetch = async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Real OpenRouter response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
})

test('handleSubmit should not fall back to mock response for openRouter models when request fails', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => {
    throw new Error('network failure')
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  globalThis.fetch = async () => {
    return {
      ok: false,
      status: 429,
    } as Response
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  globalThis.fetch = async () => {
    return {
      json: async () => ({ choices: [{ message: { content: 'Real OpenAI response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
})

test('handleSubmit should include OpenRouter limit reset and usage details in 429 message when available', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input: unknown) => {
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
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
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
  globalThis.fetch = async () => {
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
  }

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
    expect(result.sessions[0].status).toBe('finished')
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender'], ['Chat.rerender'], ['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should ignore additional streaming events after session is stopped', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  let resolveInitialRerender: (() => void) | undefined
  const initialRerenderPromise = new Promise<void>((resolve) => {
    resolveInitialRerender = resolve
  })
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {
      resolveInitialRerender?.()
    },
  })
  const originalFetch = globalThis.fetch
  let releaseFirstRead: (() => void) | undefined
  const firstReadPromise = new Promise<void>((resolve) => {
    releaseFirstRead = resolve
  })
  globalThis.fetch = async () => {
    const chunks = [
      'data: {"type":"response.output_text.delta","delta":"Streaming"}\n\n',
      'data: {"type":"response.completed"}\n\n',
      'data: [DONE]\n\n',
    ]
    let index = 0
    return {
      body: {
        getReader: () => ({
          read: async (): Promise<ReadableStreamReadResult<Uint8Array>> => {
            if (index === 0) {
              await firstReadPromise
            }
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
  }

  try {
    const state = {
      ...createDefaultState(),
      composerValue: 'stop me',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      openApiApiKey: 'oa-key-123',
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      uid: 1,
      viewMode: 'detail' as const,
    }

    const resultPromise = HandleSubmit.handleSubmit(state)
    await initialRerenderPromise
    const inProgressState = StatusBarStates.get(state.uid)?.newState
    expect(inProgressState?.sessions[0].status).toBe('in-progress')
    expect(inProgressState?.sessions[0].messages[1]).toMatchObject({
      inProgress: true,
      text: '',
    })

    const stoppedState = await HandleClick.handleClick(inProgressState || state, 'stop')
    StatusBarStates.set(state.uid, inProgressState || state, stoppedState)
    releaseFirstRead?.()

    const result = await resultPromise
    const events = await getChatViewEvents(result.selectedSessionId)

    expect(result.sessions[0].status).toBe('stopped')
    expect(result.sessions[0].messages[1]).toMatchObject({
      inProgress: false,
      text: '',
    })
    expect(events.filter((event) => event.type === 'sse-response-part')).toHaveLength(0)
    expect(events.find((event) => event.type === 'event-stream-finished')).toBeUndefined()
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should use chat message parsing worker for streaming message updates when enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) =>
      rawMessages.map((rawMessage) => [
        {
          children: [
            {
              text: rawMessage === '' ? '[empty]' : `worker:${rawMessage}`,
              type: 'text',
            },
          ],
          type: 'text',
        },
      ]),
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => {
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
  }

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

    expect(result.sessions[0].messages[1].text).toBe('Streaming')
    expect(result.parsedMessages).toEqual([
      {
        id: result.sessions[0].messages[0].id,
        parsedContent: [
          {
            children: [
              {
                text: 'worker:hello from streaming',
                type: 'text',
              },
            ],
            type: 'text',
          },
        ],
        text: 'hello from streaming',
      },
      {
        id: result.sessions[0].messages[1].id,
        parsedContent: [
          {
            children: [
              {
                text: 'worker:Streaming',
                type: 'text',
              },
            ],
            type: 'text',
          },
        ],
        text: 'Streaming',
      },
    ])
    expect(mockChatMessageParsingRpc.invocations).toEqual([
      ['ChatMessageParsing.parseMessageContents', ['hello from streaming']],
      ['ChatMessageParsing.parseMessageContents', ['']],
      ['ChatMessageParsing.parseMessageContents', ['Stream']],
      ['ChatMessageParsing.parseMessageContents', ['Streaming']],
    ])
    expect(getChatRerenderInvocations(mockRendererRpc.invocations)).toEqual([['Chat.rerender'], ['Chat.rerender'], ['Chat.rerender']])
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
  globalThis.fetch = async () => {
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
  }

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
        errorMessage: 'File not found: index.html',
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
  globalThis.fetch = async () => {
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
  }

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
=======
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }
>>>>>>> origin/main

  const result = await HandleSubmit.handleSubmit(state)

  expect(result).toEqual({
    ...state,
    composerValue: '',
    selectedSessionId: 'session-2',
    sessions: [...state.sessions, { id: 'session-2', messages: [], projectId: state.selectedProjectId, status: 'idle', title: 'Chat 2' }],
    viewMode: 'detail',
  })
  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test.skip('handleSubmit should normalize object-shaped worker errors', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => {
      throw {
        message: 'missing attachments',
      }
    },
  })
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }

  await expect(HandleSubmit.handleSubmit(state)).rejects.toThrow('missing attachments')

  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

<<<<<<< HEAD
test('handleSubmit should sync backend auth and use backend completions when useOwnBackend is enabled', async () => {
  jest.useFakeTimers()
  jest.setSystemTime(Date.parse('2026-03-25T12:00:00.000Z'))
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  const requests: { url: string; init?: RequestInit }[] = []
  globalThis.fetch = async (...args: readonly unknown[]) => {
    const [input, init] = args
    const requestInput = input as string | URL | { readonly url: string }
    const url = typeof requestInput === 'string' ? requestInput : requestInput instanceof URL ? requestInput.href : requestInput.url
    const requestInit = init as RequestInit | undefined
    requests.push(requestInit ? { init: requestInit, url } : { url })
    if (url.endsWith('/auth/refresh')) {
      return {
        json: async () => ({
          accessToken: 'access-token-1',
          subscriptionPlan: 'pro',
          usedTokens: 42,
          userName: 'test-user',
        }),
        ok: true,
        status: 200,
      } as Response
    }
    if (url.endsWith('/v1/responses')) {
      return {
        json: async () => ({
          output_text: 'Backend completion response',
        }),
        ok: true,
        status: 200,
      } as Response
    }
    return {
      ok: false,
      status: 404,
    } as Response
  }

  try {
    const state = {
      ...createDefaultState(),
      backendUrl: 'https://backend.example.com',
      composerValue: 'hello',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const }],
      selectedModelId: 'openapi/gpt-4o-mini',
      systemPrompt: '',
      useOwnBackend: true,
      viewMode: 'detail' as const,
    }

    const result = await HandleSubmit.handleSubmit(state)

    expect(result.sessions[0].messages).toHaveLength(2)
    expect(result.sessions[0].messages[1].text).toBe('Backend completion response')
    expect(requests).toHaveLength(2)
    expect(requests[0].url).toBe('https://backend.example.com/auth/refresh')
    expect(requests[1].url).toBe('https://backend.example.com/v1/responses')
    expect(requests[1].init?.headers).toEqual(
      expect.objectContaining({
        Authorization: 'Bearer access-token-1',
      }),
    )
    expect(JSON.parse(requests[1].init?.body as string)).toEqual({
      input: [
        {
          content: 'hello',
          role: 'user',
        },
      ],
      instructions: 'Current date: 2026-03-25.\n\nDo not assume your knowledge cutoff is the same as the current date.',
      max_tool_calls: defaultMaxToolCalls,
      model: 'gpt-4o-mini',
      tool_choice: 'auto',
      tools: [{ type: 'web_search' }],
    })
    expect(getChatRerenderInvocations(mockRendererRpc.invocations)).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should render mock OpenAI write_file tool calls from response.completed events', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () =>
      JSON.stringify({
        linesAdded: 1,
        linesDeleted: 0,
      }),
    'ChatTool.getTools': async () => [],
  })
  const notesUri = 'file:///workspace/notes.txt'
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk(
    `data: ${JSON.stringify({
      response: {
        id: 'resp_01',
        output: [
=======
test.skip('handleSubmit should prefer newer local state applied during submit', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async (state: ChatState) => {
      const newerState = {
        ...state,
        composerValue: '',
        selectedSessionId: 'session-2',
        sessions: [
          ...state.sessions,
>>>>>>> origin/main
          {
            id: 'session-2',
            messages: [{ id: 'message-1', role: 'user' as const, text: 'hello', time: '10:00' }],
            projectId: state.selectedProjectId,
            status: 'idle' as const,
            title: 'Chat 2',
          },
        ],
<<<<<<< HEAD
        status: 'completed',
      },
      sequence_number: 1,
      type: 'response.completed',
    })}\n\n`,
  )
  MockOpenApiStream.pushChunk('data: [DONE]\n\n')
  MockOpenApiStream.finish()

  const state = {
    ...createDefaultState(),
    composerValue: 'add one line to notes.txt',
    models: [{ id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' as const }],
    selectedModelId: 'openapi/gpt-4.1-mini',
    streamingEnabled: true,
    useMockApi: true,
    viewMode: 'detail' as const,
  }

  const result = await HandleSubmit.handleSubmit(state)

  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[1].text).toBe('')
  expect(result.sessions[0].messages[1].toolCalls).toEqual([
    {
      arguments: '{"content":"alpha\\\\nbeta\\\\ngamma","uri":"file:///workspace/notes.txt"}',
      id: 'call_01',
      name: 'write_file',
      result: '{"linesAdded":1,"linesDeleted":0}',
      status: 'success',
    },
  ])
  expect(mockRendererRpc.invocations.length).toBeGreaterThanOrEqual(2)
  expect(mockChatToolRpc.invocations).toContainEqual([
    'ChatTool.execute',
    'write_file',
    '{"content":"alpha\\\\nbeta\\\\ngamma","uri":"file:///workspace/notes.txt"}',
    { assetDir: '', platform: 0 },
  ])
})

test('handleSubmit should use plan mode instructions, restrict tools, and tag assistant replies in plan mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.getTools': async () => [
      {
        function: {
          description: 'Read file',
          name: 'read_file',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
      {
        function: {
          description: 'Write file',
          name: 'write_file',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
    ],
  })
  jest.useFakeTimers().setSystemTime(Date.parse('2026-04-12T09:00:00.000Z'))
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk('data: {"type":"response.output_text.delta","delta":"1. Inspect files"}\n\n')
  MockOpenApiStream.pushChunk('data: {"type":"response.completed"}\n\n')
  MockOpenApiStream.pushChunk('data: [DONE]\n\n')
  MockOpenApiStream.finish()

  const state = {
    ...createDefaultState(),
    agentMode: 'plan' as const,
    composerValue: 'make a plan',
    models: [{ id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' as const }],
    selectedModelId: 'openapi/gpt-4.1-mini',
    streamingEnabled: true,
    useMockApi: true,
    viewMode: 'detail' as const,
    webSearchEnabled: true,
  }

  const result = await HandleSubmit.handleSubmit(state)
  const request = result.mockOpenApiRequests[0]
  const payload = request.payload as {
    readonly instructions: string
    readonly tools: readonly { readonly name?: string; readonly type: string }[]
  }

  expect(result.sessions[0].messages[1]).toEqual(
    expect.objectContaining({
      agentMode: 'plan',
      role: 'assistant',
      text: '1. Inspect files',
    }),
  )
  expect(payload.instructions).toContain('Plan mode instructions:')
  expect(payload.instructions).toContain('Current date: 2026-04-12.')
  expect(payload.tools).toEqual([
    expect.objectContaining({
      name: 'read_file',
      type: 'function',
    }),
  ])
  expect(mockChatToolRpc.invocations).toEqual([['ChatTool.getTools']])
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerender'], ['Chat.rerender']])
})

test('handleSubmit should resolve workspaceUri placeholder in system prompt from selected project', async () => {
  jest.useFakeTimers()
  jest.setSystemTime(Date.parse('2026-03-25T12:00:00.000Z'))
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  let capturedBody: Record<string, unknown> | undefined
  globalThis.fetch = async (...args: readonly unknown[]) => {
    const [, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    const body = init?.body
    if (typeof body === 'string') {
      capturedBody = JSON.parse(body) as Record<string, unknown>
    }
    return {
      json: async () => ({ choices: [{ message: { content: 'OpenRouter response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }

  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
    openRouterApiKey: 'or-key-123',
    projects: [
      {
        id: 'project-1',
        name: 'app',
        uri: 'file:///workspace/app',
      },
    ],
    selectedModelId: 'claude-code',
    selectedProjectId: 'project-1',
    systemPrompt: 'Environment:\n- Current workspace URI: {{workspaceUri}}',
    useMockApi: false,
    viewMode: 'detail' as const,
  }

  try {
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(mockRendererRpc.invocations).toContainEqual(['Chat.rerender'])
    const messages = capturedBody?.messages as readonly { readonly role: string; readonly content: string }[] | undefined
    expect(messages?.[0]?.role).toBe('system')
    expect(messages?.[0]?.content).toContain('Current workspace URI: file:///workspace/app')
    expect(messages?.[0]?.content).toContain('Current date: 2026-03-25')
    expect(messages?.[0]?.content).toContain('Do not assume your knowledge cutoff is the same as the current date.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should resolve workspaceUri placeholder in system prompt from renderer workspace path', async () => {
  jest.useFakeTimers()
  jest.setSystemTime(Date.parse('2026-03-25T12:00:00.000Z'))
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'Workspace.getPath': async () => 'file:///workspace/from-renderer',
  })
  const originalFetch = globalThis.fetch
  let capturedBody: Record<string, unknown> | undefined
  globalThis.fetch = async (...args: readonly unknown[]) => {
    const [, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    const body = init?.body
    if (typeof body === 'string') {
      capturedBody = JSON.parse(body) as Record<string, unknown>
    }
    return {
      json: async () => ({ choices: [{ message: { content: 'OpenRouter response' } }] }),
      ok: true,
      status: 200,
    } as Response
  }

  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
    openRouterApiKey: 'or-key-123',
    selectedModelId: 'claude-code',
    systemPrompt: 'Environment:\n- Current workspace URI: {{workspaceUri}}',
    useMockApi: false,
    viewMode: 'detail' as const,
  }

  try {
    const result = await HandleSubmit.handleSubmit(state)
    expect(result.sessions[0].messages).toHaveLength(2)
    expect(mockRendererRpc.invocations).toContainEqual(['Chat.rerender'])
    expect(mockRendererRpc.invocations).toContainEqual(['Workspace.getPath'])
    const messages = capturedBody?.messages as readonly { readonly role: string; readonly content: string }[] | undefined
    expect(messages?.[0]?.role).toBe('system')
    expect(messages?.[0]?.content).toContain('Current workspace URI: file:///workspace/from-renderer')
    expect(messages?.[0]?.content).not.toContain('Current workspace URI: unknown')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should generate ai session title for new session when enabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const originalFetch = globalThis.fetch
  let requestIndex = 0
  globalThis.fetch = async () => {
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
  }

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
    expect(getChatRerenderInvocations(mockRpc.invocations)).toEqual([['Chat.rerender']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('handleSubmit should provision a background worktree for a new background session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (id: string, payload: any) => {
      expect(id).toBe('Chat.createBackgroundWorktree')
      expect(payload.projectUri).toBe('file:///workspace/app')
      expect(payload.title).toBe('Chat 2')
      return {
        branchName: 'chat/session-2',
        workspaceUri: 'file:///workspace/app.worktrees/chat-session-2',
=======
        viewMode: 'detail' as const,
      }
      set(state.uid, state, newerState)
      return {
        ...state,
        composerValue: '',
        selectedSessionId: 'session-2',
        sessions: [...state.sessions, { id: 'session-2', messages: [], projectId: state.selectedProjectId, status: 'idle', title: 'Chat 2' }],
        viewMode: 'detail' as const,
>>>>>>> origin/main
      }
    },
  })
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }

  const result = await HandleSubmit.handleSubmit(state)

  expect(result).toEqual({
    ...state,
    composerValue: '',
    selectedSessionId: 'session-2',
    sessions: [
      ...state.sessions,
      {
        id: 'session-2',
        messages: [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }],
        projectId: state.selectedProjectId,
        status: 'idle',
        title: 'Chat 2',
      },
    ],
    viewMode: 'detail',
  })
  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test.skip('handleSubmit should not fall back to stale local state when no newer update arrives', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async (state: ChatState) => ({
      ...state,
      composerValue: '',
      selectedSessionId: 'session-2',
      sessions: [...state.sessions, { id: 'session-2', messages: [], projectId: state.selectedProjectId, status: 'idle', title: 'Chat 2' }],
      viewMode: 'detail' as const,
    }),
  })
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }
  set(state.uid, state, state)

  const result = await HandleSubmit.handleSubmit(state)

  expect(result).toEqual({
    ...state,
    composerValue: '',
    selectedSessionId: 'session-2',
    sessions: [...state.sessions, { id: 'session-2', messages: [], projectId: state.selectedProjectId, status: 'idle', title: 'Chat 2' }],
    viewMode: 'detail',
  })
  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})
