import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-error-mock'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', false)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'unknown_parameter',
      message: "Unknown parameter: 'include_obfuscation'.",
      param: 'include_obfuscation',
      type: 'invalid_request_error',
    },
  })
  await Command.execute('Chat.handleInput', 'composer', 'hello from e2e', 'script')

  // act
  await Command.execute('Chat.handleSubmit')

  // assert
  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request failed (status 400): unknown_parameter [invalid_request_error].')
  await expect(messages.nth(1)).toContainText("Unknown parameter: 'include_obfuscation'.")
}
