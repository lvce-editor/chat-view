import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-mock'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', true)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'First')
  await Command.execute('Chat.handleInput', 'composer', 'hello from e2e', 'script')

  const submitPromise = Command.execute('Chat.handleSubmit')

  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('First')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', ' chunk')
  await expect(messages.nth(1)).toContainText('First chunk')

  await Command.execute('Chat.mockOpenApiStreamFinish')
  await submitPromise
  await expect(messages.nth(1)).toContainText('First chunk')
}
