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
  const message1 = messages.nth(1)
  await expect(message1).toContainText('OpenAI API key is not configured')
  const message3 = messages.nth(3)
  await expect(message3).toContainText('OpenAI API key is not configured')
  const getApiKeyLinks = Locator('[name="open-openapi-api-key-website"]')
  await expect(getApiKeyLinks).toHaveCount(2)
  const getApiKeyLink0 = getApiKeyLinks.nth(0)
  await expect(getApiKeyLink0).toHaveAttribute('href', 'https://platform.openai.com/api-keys')
  await expect(getApiKeyLink0).toHaveAttribute('target', '_blank')
  await expect(getApiKeyLink0).toHaveAttribute('rel', 'noopener noreferrer')
  const getApiKeyLink1 = getApiKeyLinks.nth(1)
  await expect(getApiKeyLink1).toHaveAttribute('href', 'https://platform.openai.com/api-keys')
  await expect(getApiKeyLink1).toHaveAttribute('target', '_blank')
  await expect(getApiKeyLink1).toHaveAttribute('rel', 'noopener noreferrer')
}
