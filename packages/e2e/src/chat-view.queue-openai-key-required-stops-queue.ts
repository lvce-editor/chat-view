import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-openai-key-required-stops-queue'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  await Chat.handleInput('first')
  await Chat.handleSubmit()
  await Chat.handleInput('second queued')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI API key is not configured')
  // TODO queued message should not be processed after blocking configuration error.
}
