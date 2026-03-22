import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-button-visible'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)

  const modelPickerToggle = Locator('.ChatSendArea button.Select[name="model-picker-toggle"]')
  const modelSelect = Locator('.ChatSendArea .Select[name="model"]')
  await expect(modelPickerToggle).toBeVisible()
  await expect(modelSelect).toHaveCount(0)
}
