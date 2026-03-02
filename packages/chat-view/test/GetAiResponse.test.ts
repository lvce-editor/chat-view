/* eslint-disable @cspell/spellchecker */

import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import { openApiApiKeyRequiredMessage, openRouterTooManyRequestsMessage } from '../src/parts/chatViewStrings/chatViewStrings.ts'
import { getAiResponse } from '../src/parts/GetAiResponse/GetAiResponse.ts'

test('getAiResponse should include OpenRouter raw 429 metadata message in assistant text', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: unknown) => {
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
      '',
      'https://api.openai.com/v1',
      'or-key-123',
      'https://openrouter.ai/api/v1',
      false,
      '',
      '',
      0,
    )

    expect(result.role).toBe('assistant')
    expect(result.text).toContain(openRouterTooManyRequestsMessage)
    expect(result.text).toContain('openai/gpt-oss-120b:free is temporarily rate-limited upstream. Please retry shortly.')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getAiResponse should use mock api command for OpenRouter models when enabled', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async (_id: string, _payload: unknown) => {
      return {
        text: 'Mocked OpenRouter response from command',
        type: 'success',
      }
    },
  })

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
    '',
    'https://api.openai.com/v1',
    '',
    'https://openrouter.ai/api/v1',
    true,
    'ChatE2e.mockApi',
    '/tmp',
    3,
  )

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

test('getAiResponse should map mock api error payloads to OpenRouter error text', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
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
    '',
    'https://api.openai.com/v1',
    '',
    'https://openrouter.ai/api/v1',
    true,
    'ChatE2e.mockApi',
    '/tmp',
    3,
  )

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

test('getAiResponse should return OpenAI key required message for OpenAPI model when key is missing', async () => {
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
    'openapi/gpt-4o-mini',
    [{ id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' }],
    '',
    'https://api.openai.com/v1',
    '',
    'https://openrouter.ai/api/v1',
    false,
    '',
    '',
    0,
  )

  expect(result.role).toBe('assistant')
  expect(result.text).toBe(openApiApiKeyRequiredMessage)
})
