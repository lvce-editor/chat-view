import { expect, test } from '@jest/globals'
import { ChatNetworkWorker } from '@lvce-editor/rpc-registry'
import { getOpenApiAssistantText } from '../src/parts/GetAiResponse/GetOpenApiAssistantText.ts'

const getRequestIdFromOptions = (options: unknown): string | undefined => {
  const requestOptions = options as { readonly headers?: Readonly<Record<string, unknown>> } | undefined
  const headers = requestOptions?.headers
  const value = headers?.['x-client-request-id']
  return typeof value === 'string' ? value : undefined
}

const getRequestBodyFromOptions = (options: unknown): Record<string, unknown> => {
  const requestOptions = options as { readonly postBody?: unknown } | undefined
  if (!requestOptions?.postBody || typeof requestOptions.postBody !== 'object') {
    return {}
  }
  return requestOptions.postBody as Record<string, unknown>
}

test('getOpenApiAssistantText should include x-client-request-id header', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => ({
      body: { choices: [{ message: { content: 'hello from openai' } }] },
      headers: {},
      statusCode: 200,
      type: 'success',
    })
  })

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

  expect(mockChatNetworkRpc.invocations).toHaveLength(1)
  expect(mockChatNetworkRpc.invocations[0]?.[0]).toBe('ChatNetwork.makeApiRequest')
  expect(mockChatNetworkRpc.invocations[0]?.[1]).toMatchObject({
    headers: {
      Authorization: 'Bearer oa-key-123',
      'Content-Type': 'application/json',
      'x-client-request-id': expect.any(String),
    },
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
  })

  const options = mockChatNetworkRpc.invocations[0]?.[1]
  const requestId = getRequestIdFromOptions(options)
  expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  const requestBody = getRequestBodyFromOptions(options)
  expect(requestBody.include_obfuscation).toBeUndefined()
})

test('getOpenApiAssistantText should include include_obfuscation when enabled', async () => {
  using mockChatNetworkRpc = ChatNetworkWorker.registerMockRpc({
    'ChatNetwork.makeApiRequest': async () => ({
      body: { choices: [{ message: { content: 'hello from openai' } }] },
      headers: {},
      statusCode: 200,
      type: 'success',
    }),
  })

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
  const requestBody = getRequestBodyFromOptions(mockChatNetworkRpc.invocations[0]?.[1])
  expect(requestBody.include_obfuscation).toBe(true)
})
