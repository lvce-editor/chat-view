import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-error-mock'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'unknown_parameter',
      message: "Unknown parameter: 'include_obfuscation'.",
      param: 'include_obfuscation',
      type: 'invalid_request_error',
    },
  })
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request failed (status 400): unknown_parameter [invalid_request_error].')
  await expect(messages.nth(1)).toContainText("Unknown parameter: 'include_obfuscation'.")
}
