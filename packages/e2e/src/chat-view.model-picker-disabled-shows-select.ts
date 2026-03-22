import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-disabled-shows-select'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const modelSelect = Locator('.ChatSendArea .Select[name="model"]')
  const modelPickerToggle = Locator('.ChatSendArea div.Select[name="model-picker-toggle"]')

  await expect(modelSelect).toBeVisible()
  await expect(modelPickerToggle).toHaveCount(0)
}
