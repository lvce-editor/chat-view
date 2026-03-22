import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-api-key-missing-invalid-input'

const rgbChannelRegex = /\d+/g

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const openAiApiKeyInput = Locator('[name="open-api-api-key"]')
  await expect(openAiApiKeyInput).toBeVisible()

  // act
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'invalid-key')

  // assert invalid input red outline
  await expect(openAiApiKeyInput).toHaveValue('invalid-key')
  await expect(Locator('[name="open-api-api-key"]:invalid')).toBeVisible()
  // @ts-ignore
  const outlineColor = await openAiApiKeyInput.evaluate((node) => getComputedStyle(node).outlineColor)
  const rgb = outlineColor.match(rgbChannelRegex)?.map(Number) || []
  const [red = 0, green = 0, blue = 0] = rgb
  // @ts-ignore
  await expect(rgb.length).toBe(3)
  // @ts-ignore
  await expect(red).toBeGreaterThan(green)
  // @ts-ignore
  await expect(red).toBeGreaterThan(blue)
}
