import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-working-indicator'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()
  await Chat.handleInput('hello from e2e')

  const submitPromise = Chat.handleSubmit()

  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Working')

  await Chat.mockOpenApiStreamPushChunk('First')
  await expect(messages.nth(1)).toContainText('First')
  await expect(messages.nth(1)).not.toContainText('Working')

  await Chat.mockOpenApiStreamFinish()
  await submitPromise
  await expect(messages.nth(1)).toContainText('First')
  await expect(messages.nth(1)).not.toContainText('Working')
}
