import { expect, test } from '@jest/globals'
import { getOpenRouterAssistantText } from '../src/parts/GetAiResponse/GetOpenRouterAssistantText.ts'

test('getOpenRouterAssistantText should return success result when response is ok', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: Parameters<typeof globalThis.fetch> | undefined
  globalThis.fetch = (async (...args: Parameters<typeof globalThis.fetch>) => {
    fetchInvocation = args
    return {
      json: async () => ({ choices: [{ message: { content: 'hello from openrouter' } }] }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await getOpenRouterAssistantText('hello', 'openrouter/model', 'or-key-123', 'https://openrouter.ai/api/v1')
    expect(result).toEqual({
      text: 'hello from openrouter',
      type: 'success',
    })
    expect(fetchInvocation).toBeDefined()
    expect(fetchInvocation?.[0]).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(fetchInvocation?.[1]).toMatchObject({
      headers: {
        Authorization: 'Bearer or-key-123',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenRouterAssistantText should return request-failed error result when fetch throws', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    throw new Error('network failure')
  }) as typeof globalThis.fetch

  try {
    const result = await getOpenRouterAssistantText('hello', 'openrouter/model', 'or-key-123', 'https://openrouter.ai/api/v1')
    expect(result).toEqual({
      details: 'request-failed',
      type: 'error',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getOpenRouterAssistantText should return too-many-requests error result for 429', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      ok: false,
      status: 429,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await getOpenRouterAssistantText('hello', 'openrouter/model', 'or-key-123', 'https://openrouter.ai/api/v1')
    expect(result).toEqual({
      details: 'too-many-requests',
      statusCode: 429,
      type: 'error',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})
