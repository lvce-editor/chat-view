/* eslint-disable jest/no-disabled-tests */
// cspell:ignore openrouter
import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker, ChatToolWorker, ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import {
  backendAccessTokenRequiredMessage,
  backendUrlRequiredMessage,
  openApiApiKeyRequiredMessage,
  openApiRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../src/parts/ChatStrings/ChatStrings.ts'
import { defaultMaxToolCalls } from '../src/parts/DefaultMaxToolCalls/DefaultMaxToolCalls.ts'
import { getAiResponse } from '../src/parts/GetAiResponse/GetAiResponse.ts'
import { getImageNotSupportedMessage } from '../src/parts/GetOpenApiErrorMessage/GetOpenApiErrorMessage.ts'
import * as MockOpenApiRequest from '../src/parts/MockOpenApiRequest/MockOpenApiRequest.ts'
import * as MockOpenApiStream from '../src/parts/MockOpenApiStream/MockOpenApiStream.ts'

test.skip('getAiResponse should use chat coordinator worker when enabled', async () => {
  const chunks: string[] = []
  let streamFinished = 0

  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.getAiResponse'() {
      return {
        id: 'assistant-1',
        role: 'assistant',
        text: 'Coordinator response',
        time: '10:01',
      }
    },
  })

  const result = await getAiResponse({
    assetDir: '',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
    nextMessageId: 2,
    onEventStreamFinished: async () => {
      streamFinished++
    },
    onTextChunk: async (chunk: string) => {
      chunks.push(chunk)
    },
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: 'oa-key-123',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-4o-mini',
    streamingEnabled: true,
    toolEnablement: {
      read_file: false,
    },
    useChatCoordinatorWorker: true,
    useChatNetworkWorkerForRequests: false,
    useMockApi: false,
    userText: 'hello',
  })

  expect(mockRpc.invocations).toEqual([
    [
      'ChatCoordinator.getAiResponse',
      expect.objectContaining({
        selectedModelId: 'openapi/gpt-4o-mini',
        toolEnablement: {
          read_file: false,
        },
        useChatNetworkWorkerForRequests: false,
        useChatToolWorker: true,
        userText: 'hello',
      }),
    ],
  ])
  expect(result.text).toBe('Coordinator response')
  expect(chunks).toEqual(['Coordinator response'])
  expect(streamFinished).toBe(1)
})

test.skip('getAiResponse should include OpenRouter raw 429 metadata message in assistant text', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: unknown): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input instanceof Request ? input.url : ''
    if (url.endsWith('/chat/completions')) {
      return {
        json: async () => ({
          error: {
            code: 429,
            message: 'Provider returned error',
            metadata: {
              raw: 'openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.',
            },
          },
        }),
        ok: false,
        status: 429,
      } as Response
    }
    return {
      ok: false,
      status: 500,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openrouter/model', name: 'OpenRouter Model', provider: 'openRouter' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: 'or-key-123',
      platform: 0,
      selectedModelId: 'openrouter/model',
      useMockApi: false,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toContain(openRouterTooManyRequestsMessage)
    expect(result.text).toContain('openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should use mock api command for OpenRouter models when enabled', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (_id: string, _payload: unknown) => {
      return {
        text: 'Mocked OpenRouter response from command',
        type: 'success',
      }
    },
  })

  const result = await getAiResponse({
    assetDir: '/tmp',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: 'ChatE2e.mockApi',
    models: [{ id: 'openrouter/model', name: 'OpenRouter Model', provider: 'openRouter' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 3,
    selectedModelId: 'openrouter/model',
    useMockApi: true,
    userText: 'hello',
  })

  expect(result.role).toBe('assistant')
  expect(result.text).toBe('Mocked OpenRouter response from command')
  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'onCommand:ChatE2e.mockApi', '/tmp', 3]])
  expect(mockExtensionHostRpc.invocations).toEqual([
    [
      'ExtensionHostCommand.executeCommand',
      'ChatE2e.mockApi',
      {
        messages: [
          {
            id: 'message-1',
            role: 'user',
            text: 'hello',
            time: '10:00',
          },
        ],
        modelId: 'model',
        openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
        openRouterApiKey: '',
      },
    ],
  ])
})

test.skip('getAiResponse should map mock api error payloads to OpenRouter error text', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (_id: string, _payload: unknown) => {
      return {
        details: 'too-many-requests',
        limitInfo: {
          limitRemaining: 2,
          retryAfter: '30',
        },
        rawMessage: 'temporary overload',
        type: 'error',
      }
    },
  })

  const result = await getAiResponse({
    assetDir: '/tmp',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: 'ChatE2e.mockApi',
    models: [{ id: 'openrouter/model', name: 'OpenRouter Model', provider: 'openRouter' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 3,
    selectedModelId: 'openrouter/model',
    useMockApi: true,
    userText: 'hello',
  })

  expect(result.role).toBe('assistant')
  expect(result.text).toContain(openRouterTooManyRequestsMessage)
  expect(result.text).toContain('temporary overload')
  expect(result.text).toContain('Retry after: 30.')
  expect(result.text).toContain('Credits remaining: 2.')
  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'onCommand:ChatE2e.mockApi', '/tmp', 3]])
  expect(mockExtensionHostRpc.invocations).toEqual([
    [
      'ExtensionHostCommand.executeCommand',
      'ChatE2e.mockApi',
      {
        messages: [
          {
            id: 'message-1',
            role: 'user',
            text: 'hello',
            time: '10:00',
          },
        ],
        modelId: 'model',
        openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
        openRouterApiKey: '',
      },
    ],
  ])
})

test.skip('getAiResponse should return OpenAI key required message for OpenAPI model when key is missing', async () => {
  const result = await getAiResponse({
    assetDir: '',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-4o-mini',
    useMockApi: false,
    userText: 'hello',
  })

  expect(result.role).toBe('assistant')
  expect(result.text).toBe(openApiApiKeyRequiredMessage)
})

test.skip('getAiResponse should reject image attachments for models without image support before calling the provider', async () => {
  MockOpenApiRequest.reset()
  const result = await getAiResponse({
    assetDir: '',
    messages: [
      {
        attachments: [
          {
            attachmentId: 'attachment-1',
            displayType: 'image',
            mimeType: 'image/svg+xml',
            name: 'photo.svg',
            previewSrc: 'data:image/svg+xml;base64,abc',
            size: 100,
          },
        ],
        id: 'message-1',
        role: 'user',
        text: 'describe this',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: 'oa-key-123',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-5-mini',
    useMockApi: true,
    userText: 'describe this',
  })

  expect(result.role).toBe('assistant')
  expect(result.text).toBe(getImageNotSupportedMessage('GPT-5 Mini'))
  expect(MockOpenApiRequest.getAll()).toEqual([])
})

test('getAiResponse should use backend completions when useOwnBackend is enabled', async () => {
  const originalFetch = globalThis.fetch
  let actualUrl = ''
  let actualInit: RequestInit | undefined
  globalThis.fetch = (async (...args: readonly unknown[]): Promise<Response> => {
    const [input, init] = args
    const requestInput = input as string | URL | { readonly url: string }
    actualUrl = typeof requestInput === 'string' ? requestInput : requestInput instanceof URL ? requestInput.href : requestInput.url
    actualInit = init as RequestInit | undefined
    return {
      json: async () => ({
        output_text: 'Backend completion response',
      }),
      ok: true,
      status: 200,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      systemPrompt: 'You are helpful.',
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toBe('Backend completion response')
    expect(actualUrl).toBe('https://backend.example.com/v1/responses')
    expect(actualInit?.method).toBe('POST')
    expect(actualInit?.headers).toEqual(
      expect.objectContaining({
        Authorization: 'Bearer backend-token',
        'Content-Type': 'application/json',
      }),
    )
    const body = actualInit?.body
    expect(typeof body).toBe('string')
    if (typeof body !== 'string') {
      throw new TypeError('Expected backend completion request body to be a string')
    }
    expect(JSON.parse(body)).toEqual({
      input: [
        {
          content: 'hello',
          role: 'user',
        },
      ],
      instructions: 'You are helpful.',
      max_tool_calls: defaultMaxToolCalls,
      model: 'gpt-4o-mini',
      tool_choice: 'auto',
      tools: [],
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should pass tools to backend responses payload', async () => {
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
  const originalFetch = globalThis.fetch
  let actualInit: RequestInit | undefined
  globalThis.fetch = (async (...args: readonly unknown[]): Promise<Response> => {
    actualInit = args[1] as RequestInit | undefined
    return {
      json: async () => ({
        output_text: 'Backend completion response',
      }),
      ok: true,
      status: 200,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      toolEnablement: {
        read_file: false,
      },
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
    })

    expect(result.text).toBe('Backend completion response')
    const body = actualInit?.body
    expect(typeof body).toBe('string')
    if (typeof body !== 'string') {
      throw new TypeError('Expected backend completion request body to be a string')
    }
    expect(JSON.parse(body)).toEqual({
      input: [
        {
          content: 'hello',
          role: 'user',
        },
      ],
      max_tool_calls: defaultMaxToolCalls,
      model: 'gpt-4o-mini',
      tool_choice: 'auto',
      tools: [
        {
          description: 'Write file',
          name: 'write_file',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
          type: 'function',
        },
      ],
    })
    expect(mockChatToolRpc.invocations).toEqual([['ChatTool.getTools']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should execute backend response tool calls and continue with previous response id', async () => {
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => '{"workspaceUri":"file:///workspace"}',
    'ChatTool.getTools': async () => [
      {
        function: {
          description: 'Get workspace uri',
          name: 'getWorkspaceUri',
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
  const originalFetch = globalThis.fetch
  const requestBodies: unknown[] = []
  const toolCallChunks: unknown[] = []
  let requestCount = 0
  globalThis.fetch = (async (...args: readonly unknown[]): Promise<Response> => {
    requestCount++
    const init = args[1] as RequestInit | undefined
    const body = init?.body
    requestBodies.push(typeof body === 'string' ? JSON.parse(body) : body)
    if (requestCount === 1) {
      return {
        json: async () => ({
          id: 'resp_1',
          output: [
            {
              arguments: '{}',
              call_id: 'call_1',
              id: 'fc_1',
              name: 'getWorkspaceUri',
              status: 'completed',
              type: 'function_call',
            },
          ],
          status: 'completed',
        }),
        ok: true,
        status: 200,
      } as Response
    }
    return {
      json: async () => ({
        id: 'resp_2',
        output: [
          {
            content: [
              {
                text: 'Workspace resolved.',
                type: 'output_text',
              },
            ],
            id: 'msg_1',
            type: 'message',
          },
        ],
        status: 'completed',
      }),
      ok: true,
      status: 200,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-5.4-mini', name: 'GPT-5.4 Mini', provider: 'openApi' }],
      nextMessageId: 2,
      onToolCallsChunk: async (toolCalls) => {
        toolCallChunks.push(toolCalls)
      },
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-5.4-mini',
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
      workspaceUri: 'file:///workspace',
    })

    expect(result.text).toBe('Workspace resolved.')
    expect(requestBodies).toEqual([
      {
        input: [
          {
            content: 'hello',
            role: 'user',
          },
        ],
        max_tool_calls: defaultMaxToolCalls,
        model: 'gpt-5.4-mini',
        tool_choice: 'auto',
        tools: [
          {
            description: 'Get workspace uri',
            name: 'getWorkspaceUri',
            parameters: {
              additionalProperties: false,
              properties: {},
              type: 'object',
            },
            type: 'function',
          },
        ],
      },
      {
        input: [
          {
            call_id: 'call_1',
            output: '{"workspaceUri":"file:///workspace"}',
            type: 'function_call_output',
          },
        ],
        max_tool_calls: defaultMaxToolCalls,
        model: 'gpt-5.4-mini',
        previous_response_id: 'resp_1',
        tool_choice: 'auto',
        tools: [
          {
            description: 'Get workspace uri',
            name: 'getWorkspaceUri',
            parameters: {
              additionalProperties: false,
              properties: {},
              type: 'object',
            },
            type: 'function',
          },
        ],
      },
    ])
    expect(toolCallChunks).toEqual([
      [
        {
          arguments: '{}',
          id: 'call_1',
          name: 'getWorkspaceUri',
          result: 'file:///workspace',
          status: 'success',
        },
      ],
    ])
    expect(mockChatToolRpc.invocations).toEqual([
      ['ChatTool.getTools'],
      ['ChatTool.execute', 'getWorkspaceUri', '{}', { assetDir: '', platform: 0, workspaceUri: 'file:///workspace' }],
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should explain invalid successful backend responses', async () => {
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.getTools': async () => [],
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({
        id: 'resp_invalid',
        output: [],
        status: 'completed',
      }),
      ok: true,
      status: 200,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-5.4-mini', name: 'GPT-5.4 Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-5.4-mini',
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
    })

    expect(result.text).toBe('Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.')
    expect(mockChatToolRpc.invocations).toEqual([['ChatTool.getTools']])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should require backend url when useOwnBackend is enabled', async () => {
  const result = await getAiResponse({
    assetDir: '',
    authAccessToken: 'backend-token',
    backendUrl: '',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-4o-mini',
    useMockApi: false,
    useOwnBackend: true,
    userText: 'hello',
  })

  expect(result.text).toBe(backendUrlRequiredMessage)
})

test('getAiResponse should require backend access token when useOwnBackend is enabled', async () => {
  const result = await getAiResponse({
    assetDir: '',
    authAccessToken: '',
    backendUrl: 'https://backend.example.com',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
    nextMessageId: 2,
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-4o-mini',
    useMockApi: false,
    useOwnBackend: true,
    userText: 'hello',
  })

  expect(result.text).toBe(backendAccessTokenRequiredMessage)
})

test('getAiResponse should return backend failure message for non-ok backend responses', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({
        error: 'Vercel AI Gateway error (status 500): Upstream request failed.',
      }),
      ok: false,
      status: 500,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
    })

    expect(result.text).toBe('Backend completion request failed (status 500). Vercel AI Gateway error (status 500): Upstream request failed.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should include backend API error message and status code for non-ok backend responses', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({
        error: 'Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.',
        statusCode: 403,
      }),
      ok: false,
      status: 403,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      authAccessToken: 'backend-token',
      backendUrl: 'https://backend.example.com',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: '',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      useMockApi: false,
      useOwnBackend: true,
      userText: 'hello',
    })

    expect(result.text).toBe(
      'Backend completion request failed (status 403). Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.',
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should use mock streaming chunks for OpenAPI model when mock mode is enabled', async () => {
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk('Hel')
  MockOpenApiStream.pushChunk('lo')
  MockOpenApiStream.finish()
  const chunks: string[] = []

  const result = await getAiResponse({
    assetDir: '',
    messages: [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    mockApiCommandId: '',
    models: [{ id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' }],
    nextMessageId: 2,
    onTextChunk: async (chunk: string) => {
      chunks.push(chunk)
    },
    openApiApiBaseUrl: 'https://api.openai.com/v1',
    openApiApiKey: '',
    openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
    openRouterApiKey: '',
    platform: 0,
    selectedModelId: 'openapi/gpt-4.1-mini',
    streamingEnabled: true,
    useMockApi: true,
    userText: 'hello',
  })

  expect(result.role).toBe('assistant')
  expect(result.text).toBe('Hello')
  expect(chunks).toEqual(['Hel', 'lo'])
})

test.skip('getAiResponse should include OpenAI 429 quota error message details in assistant text', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({
        error: {
          code: 'insufficient_quota',
          message:
            'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.',
          param: null,
          type: 'insufficient_quota',
        },
      }),
      ok: false,
      status: 429,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: 'oa-key-123',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      useMockApi: false,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toContain('OpenAI rate limit exceeded (429: insufficient_quota) [insufficient_quota].')
    expect(result.text).toContain('You exceeded your current quota, please check your plan and billing details.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should include OpenAI http error details for non-429 responses', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({
        error: {
          code: 'invalid_api_key',
          message: 'Incorrect API key provided.',
          type: 'invalid_request_error',
        },
      }),
      ok: false,
      status: 401,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: 'oa-key-123',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      useMockApi: false,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toBe('OpenAI request failed (Status 401): Invalid API key. Please verify your OpenAI API key in Chat Settings.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should show a helpful message when OpenAI tool-call iterations are exhausted', async () => {
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => '{"uri":"file:///workspace"}',
    'ChatTool.getTools': async () => [],
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    const chunks = [
      'data: {"type":"response.output_item.added","item":{"type":"function_call","id":"fc_1","call_id":"call_1","name":"get_workspace_uri","arguments":""}}\n\n',
      'data: {"type":"response.function_call_arguments.delta","item_id":"fc_1","delta":"{}"}\n\n',
      'data: {"type":"response.output_item.done","item_id":"fc_1","item":{"type":"function_call","id":"fc_1","call_id":"call_1","name":"get_workspace_uri","arguments":"{}"}}\n\n',
      'data: {"type":"response.completed","response":{"id":"resp_loop","output":[{"type":"function_call","id":"fc_1","call_id":"call_1","name":"get_workspace_uri","arguments":"{}"}],"status":"completed"}}\n\n',
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
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: 'oa-key-123',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      useMockApi: false,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toContain(`OpenAI request ended after ${defaultMaxToolCalls} tool-call rounds without a final assistant response.`)
    expect(result.text).toContain('model got stuck in a tool loop')
    const executeInvocations = mockChatToolRpc.invocations.filter((invocation) => invocation[0] === 'ChatTool.execute')
    expect(executeInvocations).toHaveLength(defaultMaxToolCalls)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should fall back to generic OpenAI request failed message when no error payload is returned', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (): Promise<Response> => {
    return {
      json: async () => ({}),
      ok: false,
      status: 500,
    } as Response
  })

  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: 'oa-key-123',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      useMockApi: false,
      userText: 'hello',
    })

    expect(result.role).toBe('assistant')
    expect(result.text).toBe('OpenAI request failed (status 500).')
    expect(result.text).not.toBe(openApiRequestFailedMessage)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test.skip('getAiResponse should stream OpenAI chunks when enabled', async () => {
  const originalFetch = globalThis.fetch
  let requestedUrl = ''
  globalThis.fetch = (async (input: unknown): Promise<Response> => {
    requestedUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input instanceof Request ? input.url : ''
    const chunks = [
      'data: {"type":"response.output_text.delta","delta":"Hello"}\n\n',
      'data: {"type":"response.output_text.delta","delta":" world"}\n\n',
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
  })

  const streamedChunks: string[] = []
  try {
    const result = await getAiResponse({
      assetDir: '',
      messages: [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      mockApiCommandId: '',
      models: [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
      nextMessageId: 2,
      onTextChunk: async (chunk: string) => {
        streamedChunks.push(chunk)
      },
      openApiApiBaseUrl: 'https://api.openai.com/v1',
      openApiApiKey: 'oa-key-123',
      openRouterApiBaseUrl: 'https://openrouter.ai/api/v1',
      openRouterApiKey: '',
      platform: 0,
      selectedModelId: 'openapi/gpt-4o-mini',
      streamingEnabled: true,
      useMockApi: false,
      userText: 'hello',
    })

    expect(requestedUrl).toBe('https://api.openai.com/v1/responses')
    expect(streamedChunks).toEqual(['Hello', ' world'])
    expect(result.role).toBe('assistant')
    expect(result.text).toBe('Hello world')
  } finally {
    globalThis.fetch = originalFetch
  }
})
