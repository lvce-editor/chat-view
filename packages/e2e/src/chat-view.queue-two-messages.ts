import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-two-messages'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.output_text.delta","delta":"assistant-1"}\n\n')

  await Chat.handleInput('first')
  const firstSubmitPromise = Chat.handleSubmit()
  await expect(Locator('.ChatMessages .Message')).toHaveCount(2)

  await Chat.handleInput('second')
  await Chat.handleSubmit()
  await Chat.handleInput('third')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  await expect(messages.nth(2)).toContainText('second')
  await expect(messages.nth(2)).toHaveClass('Message MessageUser MessageQueued')
  await expect(messages.nth(3)).toContainText('third')
  await expect(messages.nth(3)).toHaveClass('Message MessageUser MessageQueued')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.completed"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.output_text.delta","delta":"assistant-2"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.completed"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.output_text.delta","delta":"assistant-3"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.completed"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await firstSubmitPromise
  await expect(messages).toHaveCount(6)
  await expect(messages.nth(0)).toContainText('first')
  await expect(messages.nth(1)).toContainText('assistant-1')
  await expect(messages.nth(2)).toContainText('second')
  await expect(messages.nth(3)).toContainText('assistant-2')
  await expect(messages.nth(4)).toContainText('third')
  await expect(messages.nth(5)).toContainText('assistant-3')
}
