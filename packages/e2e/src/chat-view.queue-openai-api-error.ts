import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-openai-api-error'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'invalid_request_error',
      message: 'bad payload',
      type: 'invalid_request_error',
    },
  })

  await Chat.handleInput('first')
  await Chat.handleSubmit()
  await Chat.handleInput('second queued')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  // TODO decide whether non-blocking API errors should continue draining or pause queue.
}
