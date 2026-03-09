import { expect, test } from '@jest/globals'
import { getOpenApiAssistantText } from '../src/parts/GetOpenApiAssistantText/GetOpenApiAssistantText.ts'

const getRequestIdFromInit = (init: unknown): string | undefined => {
  const requestInit = init as RequestInit | undefined
  const headers = requestInit?.headers as Record<string, unknown> | undefined
  const value = headers?.['x-client-request-id']
  return typeof value === 'string' ? value : undefined
}

const getRequestBodyFromInit = (init: unknown): Record<string, unknown> => {
  const requestInit = init as RequestInit | undefined
  const body = requestInit?.body
  if (typeof body !== 'string') {
    return {}
  }
  return JSON.parse(body) as Record<string, unknown>
}

test('getOpenApiAssistantText should include x-client-request-id header', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: readonly unknown[] | undefined
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    fetchInvocation = args
    return {
      json: async () => ({ output_text: 'hello from openai' }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await getOpenApiAssistantText(
      [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      'openai/gpt-4o-mini',
      'oa-key-123',
      'https://api.openai.com/v1',
      '',
      0,
    )

    expect(result).toEqual({
      text: 'hello from openai',
      type: 'success',
    })

    expect(fetchInvocation?.[0]).toBe('https://api.openai.com/v1/responses')
    expect(fetchInvocation?.[1]).toMatchObject({
      headers: {
        Authorization: 'Bearer oa-key-123',
        'Content-Type': 'application/json',
        'x-client-request-id': expect.any(String),
      },
      method: 'POST',
    })

    const requestId = getRequestIdFromInit(fetchInvocation?.[1] as RequestInit | undefined)
    expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    const requestBody = getRequestBodyFromInit(fetchInvocation?.[1] as RequestInit | undefined)
    expect(requestBody.include_obfuscation).toBeUndefined()
    expect(requestBody.stream_options).toBeUndefined()
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenApiAssistantText should include include_obfuscation in stream_options when streaming and includeObfuscation is false', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: readonly unknown[] | undefined
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    fetchInvocation = args
    return {
      json: async () => ({ output_text: 'hello from openai' }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    await getOpenApiAssistantText(
      [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      'openai/gpt-4o-mini',
      'oa-key-123',
      'https://api.openai.com/v1',
      '',
      0,
      {
        includeObfuscation: false,
        stream: true,
      },
    )
    const requestBody = getRequestBodyFromInit(fetchInvocation?.[1] as RequestInit | undefined)
    expect(requestBody.include_obfuscation).toBeUndefined()
    expect(requestBody.stream_options).toEqual({
      include_obfuscation: false,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenApiAssistantText should not include include_obfuscation when includeObfuscation is true', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: readonly unknown[] | undefined
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    fetchInvocation = args
    return {
      json: async () => ({ output_text: 'hello from openai' }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    await getOpenApiAssistantText(
      [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      'openai/gpt-4o-mini',
      'oa-key-123',
      'https://api.openai.com/v1',
      '',
      0,
      {
        includeObfuscation: true,
        stream: true,
      },
    )
    const requestBody = getRequestBodyFromInit(fetchInvocation?.[1] as RequestInit | undefined)
    expect(requestBody.include_obfuscation).toBeUndefined()
    expect(requestBody.stream_options).toBeUndefined()
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenApiAssistantText should expose streaming tool calls without automatic follow-up requests', async () => {
  const originalFetch = globalThis.fetch
  const fetchInvocations: readonly unknown[][] = []
  let requestCount = 0
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    fetchInvocations.push(args)
    requestCount += 1
    const firstResponseChunks = [
      'data: {"type":"response.output_item.added","output_index":0,"item":{"type":"function_call","call_id":"call_1","name":"invalid_tool","arguments":""}}\n\n',
      'data: {"type":"response.function_call_arguments.delta","output_index":0,"delta":"{\\"path\\":\\"index.html\\"}"}\n\n',
      'data: {"type":"response.completed","response":{"id":"resp_1","output":[{"type":"function_call","call_id":"call_1","name":"invalid_tool","arguments":"{\\"path\\":\\"index.html\\"}"}]}}\n\n',
      'data: [DONE]\n\n',
    ]
    const secondResponseChunks = [
      'data: {"type":"response.created","response":{"id":"resp_2"}}\n\n',
      'data: {"type":"response.output_text.delta","delta":"done"}\n\n',
      'data: {"type":"response.completed","response":{"id":"resp_2","output":[]}}\n\n',
      'data: [DONE]\n\n',
    ]
    const chunks = requestCount === 1 ? firstResponseChunks : secondResponseChunks
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

  const dataEvents: unknown[] = []
  const toolCallsChunks: unknown[] = []
  let finishedCount = 0

  try {
    const result = await getOpenApiAssistantText(
      [
        {
          id: 'message-1',
          role: 'user',
          text: 'read index.html',
          time: '10:00',
        },
      ],
      'openai/gpt-4o-mini',
      'oa-key-123',
      'https://api.openai.com/v1',
      '',
      0,
      {
        onDataEvent: async (value: unknown) => {
          dataEvents.push(value)
        },
        onEventStreamFinished: async () => {
          finishedCount += 1
        },
        onToolCallsChunk: async (toolCalls) => {
          toolCallsChunks.push(toolCalls)
        },
        stream: true,
      },
    )

    expect(result).toEqual({
      text: '',
      type: 'success',
    })
    expect(fetchInvocations).toHaveLength(1)
    expect(dataEvents).toHaveLength(3)
    expect(finishedCount).toBe(1)
    expect(toolCallsChunks.at(-1)).toEqual([
      {
        arguments: '{"path":"index.html"}',
        id: 'call_1',
        name: 'invalid_tool',
      },
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})
