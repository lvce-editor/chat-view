import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-select-model'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const toggleButton = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  await Command.execute('Chat.openModelPicker')
  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await expect(searchInput).toBeVisible()
  await expect(searchInput).toBeFocused()

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(19)
  await expect(items.nth(5)).toContainText('GPT-4.1 Mini')
  await items.nth(5).click()

  await expect(Locator('.ChatModelPicker')).toHaveCount(0)
  await expect(toggleButton).toContainText('GPT-4.1 Mini')
}
