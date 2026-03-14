import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-key-not-configured'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  // act
  await Chat.handleInput('first message')
  await Chat.handleSubmit()
  await Chat.handleInput('second message')
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  await expect(messages.nth(1)).toContainText('OpenAI API key is not configured')
  await expect(messages.nth(3)).toContainText('OpenAI API key is not configured')
}
