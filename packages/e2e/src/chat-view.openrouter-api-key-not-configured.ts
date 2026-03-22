// cspell:ignore openrouter
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openrouter-api-key-not-configured'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openRouter/meta-llama/llama-3.3-70b-instruct:free')
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenRouter API key is not configured')
  const openRouterApiKeyInput = Locator('[name="open-router-api-key"]')
  await expect(openRouterApiKeyInput).toBeVisible()
  await expect(openRouterApiKeyInput).toHaveAttribute('pattern', null)
  const getApiKeyLink = Locator('[name="open-openrouter-api-key-settings"]')
  await expect(getApiKeyLink).toHaveAttribute('href', 'https://openrouter.ai/settings/keys')
  await expect(getApiKeyLink).toHaveAttribute('target', '_blank')
  await expect(getApiKeyLink).toHaveAttribute('rel', 'noopener noreferrer')
}
