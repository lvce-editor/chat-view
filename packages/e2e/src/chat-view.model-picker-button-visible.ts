import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-button-visible'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const modelPickerToggle = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  const modelSelect = Locator('.ChatSendArea .Select[name="model"]')
  await expect(modelPickerToggle).toBeVisible()
  await expect(modelSelect).toHaveCount(0)
}
