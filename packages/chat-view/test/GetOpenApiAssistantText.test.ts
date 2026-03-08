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
    expect(requestBody.include_obfuscation).toBe(false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenApiAssistantText should include include_obfuscation when enabled', async () => {
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
        stream: false,
      },
    )
    const requestBody = getRequestBodyFromInit(fetchInvocation?.[1] as RequestInit | undefined)
    expect(requestBody.include_obfuscation).toBe(true)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenApiAssistantText should emit data events, tool call chunks, and stream finished callbacks', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    const chunks = [
      'data: {"type":"response.output_item.added","output_index":0,"item":{"type":"function_call","call_id":"call_1","name":"read_file","arguments":""}}\n\n',
      'data: {"type":"response.function_call_arguments.delta","output_index":0,"delta":"{\\"path\\":\\"index.html\\"}"}\n\n',
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
    expect(dataEvents).toHaveLength(3)
    expect(finishedCount).toBe(1)
    expect(toolCallsChunks.at(-1)).toEqual([
      {
        arguments: '{"path":"index.html"}',
        id: 'call_1',
        name: 'read_file',
      },
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})
