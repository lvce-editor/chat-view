/* eslint-disable @cspell/spellchecker */

import { expect, test } from '@jest/globals'
import { getOpenRouterAssistantText } from '../src/parts/GetAiResponse/GetOpenRouterAssistantText.ts'

test('getOpenRouterAssistantText should return success result when response is ok', async () => {
  const originalFetch = globalThis.fetch
  let fetchInvocation: readonly unknown[] | undefined
  globalThis.fetch = (async (...args: readonly unknown[]) => {
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

test('getOpenRouterAssistantText should include limit info for 429 when auth key endpoint returns usage data', async () => {
  const originalFetch = globalThis.fetch
  let invocationCount = 0
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    invocationCount++
    const url = String(input)
    if (url.endsWith('/chat/completions')) {
      return {
        headers: {
          get: (name: string) => (name === 'retry-after' ? '30' : null),
        },
        ok: false,
        status: 429,
      } as Response
    }
    return {
      json: async () => ({
        data: {
          limit_remaining: 1.5,
          limit_reset: 'daily',
          usage: 12.25,
          usage_daily: 0.75,
        },
      }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await getOpenRouterAssistantText('hello', 'openrouter/model', 'or-key-123', 'https://openrouter.ai/api/v1')
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
    expect(invocationCount).toBe(2)
  } finally {
    globalThis.fetch = originalFetch
  }
})
