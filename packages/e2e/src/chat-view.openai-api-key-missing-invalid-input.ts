import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-key-missing-invalid-input'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert missing api key dom
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI API key is not configured')
  const openAiApiKeyInput = Locator('[name="open-api-api-key"]')
  await expect(openAiApiKeyInput).toBeVisible()

  // act: enter invalid key and click save
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'invalid-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')

  // assert invalid input red outline
  await expect(openAiApiKeyInput).toHaveValue('invalid-key')
  await expect(Locator('[name="open-api-api-key"]:invalid')).toBeVisible()
  const outlineColor = await openAiApiKeyInput.evaluate((node) => getComputedStyle(node).outlineColor)
  const rgb = outlineColor.match(/\d+/g)?.map(Number) || []
  const [red = 0, green = 0, blue = 0] = rgb
  await expect(rgb.length).toBe(3)
  await expect(red).toBeGreaterThan(green)
  await expect(red).toBeGreaterThan(blue)
}
