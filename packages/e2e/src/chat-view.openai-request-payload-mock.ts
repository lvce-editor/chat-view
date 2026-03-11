import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-request-payload-mock'

interface MockOpenApiRequest {
  readonly headers: Readonly<Record<string, string>>
  readonly method: string
  readonly payload: unknown
  readonly url: string
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Command.execute('Chat.mockOpenApiRequestReset')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', '2')
  await Command.execute('Chat.mockOpenApiStreamFinish')
  await Chat.handleInput("what's 1+1")

  // act
  await Chat.handleSubmit()

  // assert mocked assistant response
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText('2')

  // assert mocked outbound OpenAI request
  const requests = (await Command.execute('Chat.mockOpenApiRequestGetAll')) as readonly MockOpenApiRequest[]
  expect(requests.length).toBe(1)

  const request = requests[0]
  expect(request.url).toBe('https://api.openai.com/v1/responses')
  expect(request.method).toBe('POST')
  expect(request.headers.Authorization).toBe('Bearer sk-e2e-openai-key')
  expect(request.headers['Content-Type']).toBe('application/json')
  expect(typeof request.headers['x-client-request-id']).toBe('string')

  const payload = request.payload as {
    readonly input: readonly { readonly content: string; readonly role: string }[]
    readonly model: string
    readonly stream: boolean
    readonly stream_options: {
      readonly include_obfuscation: boolean
    }
    readonly tool_choice: string
    readonly tools: readonly { readonly type: string }[]
  }

  expect(payload.model).toBe('gpt-4.1-mini')
  expect(payload.stream).toBe(true)
  expect(payload.stream_options.include_obfuscation).toBe(false)
  expect(payload.tool_choice).toBe('auto')
  expect(payload.input.length).toBe(1)
  expect(payload.input[0]).toEqual({
    content: "what's 1+1",
    role: 'user',
  })
  expect(payload.tools.length > 0).toBe(true)
  expect(payload.tools.some((tool) => tool.type === 'web_search')).toBe(true)
}
