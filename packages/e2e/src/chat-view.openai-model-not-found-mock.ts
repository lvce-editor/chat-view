import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-model-not-found-mock'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'model_not_found',
      message: "The requested model 'gpt-4.1-mini-wrong' does not exist.",
      param: 'model',
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
    `OpenAI request failed (status 400): model_not_found [invalid_request_error]. The requested model 'gpt-4.1-mini-wrong' does not exist.`,
  )
}
