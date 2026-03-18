import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-message-basic'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.output_text.delta","delta":"first reply"}\n\n')

  await Chat.handleInput('first user message')
  const firstSubmitPromise = Chat.handleSubmit()
  await expect(Locator('.ChatMessages .Message')).toHaveCount(2)

  await Chat.handleInput('queued user message')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(2)).toContainText('queued user message')
  await expect(messages.nth(2)).toHaveClass('Message MessageUser MessageQueued')
  await expect(composer).toHaveValue('')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.completed"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.output_text.delta","delta":"second reply"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: {"type":"response.completed"}\n\n')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await firstSubmitPromise
  await expect(messages).toHaveCount(4)
  await expect(messages.nth(0)).toContainText('first user message')
  await expect(messages.nth(1)).toContainText('first reply')
  await expect(messages.nth(2)).toContainText('queued user message')
  await expect(messages.nth(3)).toContainText('second reply')
}
