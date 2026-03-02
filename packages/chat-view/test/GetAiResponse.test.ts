/* eslint-disable @cspell/spellchecker */

import { expect, test } from '@jest/globals'
import { getAiResponse } from '../src/parts/GetAiResponse/GetAiResponse.ts'
import { openRouterTooManyRequestsMessage } from '../src/parts/chatViewStrings/chatViewStrings.ts'

test('getAiResponse should include OpenRouter raw 429 metadata message in assistant text', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input)
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
  }) as typeof globalThis.fetch

  try {
    const result = await getAiResponse(
      'hello',
      [
        {
          id: 'message-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
      ],
      2,
      'openrouter/model',
      [{ id: 'openrouter/model', name: 'OpenRouter Model', provider: 'openRouter' }],
      'or-key-123',
      'https://openrouter.ai/api/v1',
    )

    expect(result.role).toBe('assistant')
    expect(result.text).toContain(openRouterTooManyRequestsMessage)
    expect(result.text).toContain('openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.')
  } finally {
    globalThis.fetch = originalFetch
  }
})
