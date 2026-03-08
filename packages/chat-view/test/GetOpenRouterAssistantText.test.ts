// cspell:ignore openrouter
import { expect, test } from '@jest/globals'
import { ChatNetworkWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { getOpenRouterAssistantText } from '../src/parts/GetAiResponse/GetOpenRouterAssistantText.ts'

interface InvokeOptions {
  readonly headers?: Readonly<Record<string, unknown>>
  readonly method?: string
  readonly postBody?: unknown
  readonly url?: string
}

const getRequestBodyFromOptions = (options: unknown): Record<string, unknown> => {
  const requestOptions = options as InvokeOptions | undefined
  if (!requestOptions?.postBody || typeof requestOptions.postBody !== 'object') {
    return {}
  }
  return requestOptions.postBody as Record<string, unknown>
}

const getRequestIdFromOptions = (options: unknown): string | undefined => {
  const requestOptions = options as InvokeOptions | undefined
  const headers = requestOptions?.headers
  const value = headers?.['x-client-request-id']
  return typeof value === 'string' ? value : undefined
}

test('getOpenRouterAssistantText should return success result when response is ok', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => ({
      body: { choices: [{ message: { content: 'hello from openrouter' } }] },
      headers: {},
      statusCode: 200,
      type: 'success',
    }),
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
      {
        id: 'message-2',
        role: 'assistant',
        text: 'Hi! How can I help?',
        time: '10:01',
      },
      {
        id: 'message-3',
        role: 'user',
        text: 'Explain recursion.',
        time: '10:02',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    text: 'hello from openrouter',
    type: 'success',
  })

  expect(mockChatNetworkRpc.invocations).toHaveLength(1)
  expect(mockChatNetworkRpc.invocations[0]?.[0]).toBe('ChatNetwork.makeApiRequest')
  expect(mockChatNetworkRpc.invocations[0]?.[1]).toMatchObject({
    headers: {
      Authorization: 'Bearer or-key-123',
      'Content-Type': 'application/json',
      'x-client-request-id': expect.any(String),
    },
    method: 'POST',
    url: 'https://openrouter.ai/api/v1/chat/completions',
  })

  const requestId = getRequestIdFromOptions(mockChatNetworkRpc.invocations[0]?.[1])
  expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)

  const payload = getRequestBodyFromOptions(mockChatNetworkRpc.invocations[0]?.[1])
  expect(payload.messages).toEqual([
    { content: 'hello', role: 'user' },
    { content: 'Hi! How can I help?', role: 'assistant' },
    { content: 'Explain recursion.', role: 'user' },
  ])
  expect(payload.model).toBe('openrouter/model')
  expect(payload.tool_choice).toBe('auto')
  expect(payload.tools).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        function: expect.objectContaining({ name: 'read_file' }),
        type: 'function',
      }),
      expect.objectContaining({
        function: expect.objectContaining({ name: 'write_file' }),
        type: 'function',
      }),
      expect.objectContaining({
        function: expect.objectContaining({ name: 'list_files' }),
        type: 'function',
      }),
    ]),
  )
})

test('getOpenRouterAssistantText should return request-failed error result when rpc request fails', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => {
      throw new Error('network failure')
    },
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    details: 'request-failed',
    type: 'error',
  })
  expect(mockChatNetworkRpc.invocations).toHaveLength(1)
})

test('getOpenRouterAssistantText should return too-many-requests error result for 429', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => ({
      headers: {},
      response: '',
      statusCode: 429,
      type: 'error',
    }),
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    details: 'too-many-requests',
    statusCode: 429,
    type: 'error',
  })
  expect(mockChatNetworkRpc.invocations).toHaveLength(2)
})

test('getOpenRouterAssistantText should include limit info for 429 when auth key endpoint returns usage data', async () => {
  const requestIds: string[] = []
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async (options: unknown) => {
      const invokeOptions = options as InvokeOptions
      const requestId = getRequestIdFromOptions(invokeOptions)
      if (requestId) {
        requestIds.push(requestId)
      }
      if (invokeOptions.url?.endsWith('/chat/completions')) {
        return {
          headers: {
            'retry-after': '30',
          },
          response: '',
          statusCode: 429,
          type: 'error',
        }
      }
      return {
        body: {
          data: {
            limit_remaining: 1.5,
            limit_reset: 'daily',
            usage: 12.25,
            usage_daily: 0.75,
          },
        },
        headers: {},
        statusCode: 200,
        type: 'success',
      }
    },
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    details: 'too-many-requests',
    limitInfo: {
      limitRemaining: 1.5,
      limitReset: 'daily',
      retryAfter: '30',
      usage: 12.25,
      usageDaily: 0.75,
    },
    statusCode: 429,
    type: 'error',
  })
  expect(mockChatNetworkRpc.invocations).toHaveLength(2)
  expect(requestIds).toHaveLength(2)
  expect(requestIds[0]).not.toBe(requestIds[1])
})

test('getOpenRouterAssistantText should include raw metadata message for 429', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async (options: unknown) => {
      const invokeOptions = options as InvokeOptions
      if (invokeOptions.url?.endsWith('/chat/completions')) {
        return {
          headers: {},
          response: JSON.stringify({
            error: {
              code: 429,
              message: 'Provider returned error',
              metadata: {
                raw: 'openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.',
              },
            },
          }),
          statusCode: 429,
          type: 'error',
        }
      }
      return {
        headers: {},
        response: '',
        statusCode: 500,
        type: 'error',
      }
    },
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    details: 'too-many-requests',
    rawMessage: 'openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.',
    statusCode: 429,
    type: 'error',
  })
  expect(mockChatNetworkRpc.invocations).toHaveLength(2)
})

test('getOpenRouterAssistantText should execute read_file tool calls and continue completion', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'FileSystem.readFile': async (path: string) => {
      expect(path).toBe('README.md')
      return '# Workspace Readme'
    },
  })
  let invocationCount = 0
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => {
      invocationCount++
      if (invocationCount === 1) {
        return {
          body: {
            choices: [
              {
                message: {
                  content: '',
                  role: 'assistant',
                  tool_calls: [
                    {
                      function: {
                        arguments: JSON.stringify({ path: 'README.md' }),
                        name: 'read_file',
                      },
                      id: 'tool-1',
                      type: 'function',
                    },
                  ],
                },
              },
            ],
          },
          headers: {},
          statusCode: 200,
          type: 'success',
        }
      }
      return {
        body: {
          choices: [{ message: { content: 'Loaded README successfully.' } }],
        },
        headers: {},
        statusCode: 200,
        type: 'success',
      }
    },
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'read README.md',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '/tmp',
    3,
  )
  expect(result).toEqual({
    text: 'Loaded README successfully.',
    type: 'success',
  })
  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', 'README.md']])
  expect(mockChatNetworkRpc.invocations).toHaveLength(2)
})

test('getOpenRouterAssistantText should block tool paths outside workspace', async () => {
  const requests: Array<{ readonly messages?: ReadonlyArray<Readonly<Record<string, unknown>>> }> = []
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async (options: unknown) => {
      const requestBody = getRequestBodyFromOptions(options) as { readonly messages?: ReadonlyArray<Readonly<Record<string, unknown>>> }
      requests.push(requestBody)
      if (requests.length === 1) {
        return {
          body: {
            choices: [
              {
                message: {
                  content: '',
                  role: 'assistant',
                  tool_calls: [
                    {
                      function: {
                        arguments: JSON.stringify({ path: '../secret.txt' }),
                        name: 'read_file',
                      },
                      id: 'tool-1',
                      type: 'function',
                    },
                  ],
                },
              },
            ],
          },
          headers: {},
          statusCode: 200,
          type: 'success',
        }
      }
      return {
        body: {
          choices: [{ message: { content: 'Denied as expected.' } }],
        },
        headers: {},
        statusCode: 200,
        type: 'success',
      }
    },
  })

  const result = await getOpenRouterAssistantText(
    [
      {
        id: 'message-1',
        role: 'user',
        text: 'read ../secret.txt',
        time: '10:00',
      },
    ],
    'openrouter/model',
    'or-key-123',
    'https://openrouter.ai/api/v1',
    '',
    0,
  )
  expect(result).toEqual({
    text: 'Denied as expected.',
    type: 'success',
  })
  const secondRequestMessages = requests[1]?.messages ?? []
  const toolResultMessage = secondRequestMessages.find((message) => message.role === 'tool')
  const toolResultContent = typeof toolResultMessage?.content === 'string' ? toolResultMessage.content : ''
  expect(toolResultContent).toContain('Access denied')
  expect(mockChatNetworkRpc.invocations).toHaveLength(2)
})
