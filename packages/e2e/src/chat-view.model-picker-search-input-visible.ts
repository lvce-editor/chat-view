import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-input-visible'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await expect(searchInput).toBeVisible()
  await expect(searchInput).toHaveAttribute('placeholder', 'Search models')
}
