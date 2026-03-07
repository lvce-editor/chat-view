import { expect, test } from '@jest/globals'
import { getOpenApiAssistantText } from '../src/parts/GetAiResponse/GetOpenApiAssistantText.ts'

const getRequestIdFromInit = (init: unknown): string | undefined => {
  const requestInit = init as RequestInit | undefined
  const headers = requestInit?.headers as Record<string, unknown> | undefined
  const value = headers?.['x-client-request-id']
  return typeof value === 'string' ? value : undefined
}

test('getOpenApiAssistantText should include x-client-request-id header', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: readonly unknown[] | undefined
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    fetchInvocation = args
    return {
      json: async () => ({ choices: [{ message: { content: 'hello from openai' } }] }),
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

    expect(fetchInvocation?.[0]).toBe('https://api.openai.com/v1/chat/completions')
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
  } finally {
    globalThis.fetch = originalFetch
  }
})
