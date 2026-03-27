import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-unsupported-parameter-reasoning-effort'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'unsupported_parameter',
      message: "Unsupported parameter: 'reasoning.effort' is not supported with this model.",
      param: 'reasoning.effort',
      type: 'invalid_request_error',
    },
  })
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText(
    "OpenAI request failed (status 400): unsupported_parameter [invalid_request_error]. Unsupported parameter: 'reasoning.effort' is not supported with this model.",
  )
}
