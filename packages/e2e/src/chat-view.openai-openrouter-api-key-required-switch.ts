import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-openrouter-api-key-required-switch'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert openai api key required
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI API key is not configured')
  const openAiApiKeyInput = Locator('[name="open-api-api-key"]')
  await expect(openAiApiKeyInput).toBeVisible()

  // act: switch model and submit again
  await Chat.handleModelChange('openRouter/meta-llama/llama-3.3-70b-instruct:free')
  await Chat.handleInput('try again')
  await Chat.handleSubmit()

  // assert openrouter api key required
  await expect(messages).toHaveCount(4)
  await expect(messages.nth(2)).toHaveText('try again')
  await expect(messages.nth(3)).toContainText('OpenRouter API key is not configured')
  const openRouterApiKeyInput = Locator('[name="open-router-api-key"]')
  await expect(openRouterApiKeyInput).toBeVisible()
}
