import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-request-payload-mock'

interface MockOpenApiRequest {
  readonly headers: Readonly<Record<string, string>>
  readonly method: string
  readonly payload: unknown
  readonly url: string
}

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(message)
  }
}

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

const assertDeepEqual = (actual: unknown, expected: unknown, context: string): void => {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(`${context}: expected ${expectedJson}, got ${actualJson}`)
  }
}

export const skip = 1

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
  assertEqual(requests.length, 1, 'OpenAI request count')

  const request = requests[0]
  assertEqual(request.url, 'https://api.openai.com/v1/responses', 'OpenAI request URL')
  assertEqual(request.method, 'POST', 'OpenAI request method')
  assertEqual(request.headers.Authorization, 'Bearer sk-e2e-openai-key', 'OpenAI auth header')
  assertEqual(request.headers['Content-Type'], 'application/json', 'OpenAI content-type header')
  assertEqual(typeof request.headers['x-client-request-id'], 'string', 'OpenAI x-client-request-id header type')

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

  assertEqual(payload.model, 'gpt-4.1-mini', 'OpenAI payload model')
  assertEqual(payload.stream, true, 'OpenAI payload stream flag')
  assertEqual(payload.stream_options.include_obfuscation, false, 'OpenAI payload stream_options.include_obfuscation')
  assertEqual(payload.tool_choice, 'auto', 'OpenAI payload tool_choice')
  assertEqual(payload.input.length, 1, 'OpenAI payload input length')
  assertDeepEqual(
    payload.input[0],
    {
      content: "what's 1+1",
      role: 'user',
    },
    'OpenAI payload first input',
  )
  assert(payload.tools.length > 0, 'OpenAI payload should include at least one tool')
  assert(
    payload.tools.some((tool) => tool.type === 'web_search'),
    'OpenAI payload should include web_search tool',
  )
}
