import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-key-not-configured'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.handleInput('first message')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI API key is not configured')
  const getApiKeyLinks = Locator('[name="open-openapi-api-key-website"]')
  await expect(getApiKeyLinks).toHaveCount(1)
  await expect(getApiKeyLinks.nth(0)).toHaveAttribute('href', 'https://platform.openai.com/api-keys')
  await expect(getApiKeyLinks.nth(0)).toHaveAttribute('target', '_blank')
  await expect(getApiKeyLinks.nth(0)).toHaveAttribute('rel', 'noopener noreferrer')
}
