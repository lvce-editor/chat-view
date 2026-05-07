import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-filters-models'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.openModelPicker()

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(19)

  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await searchInput.type('codex')

  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toContainText('Codex 5.3')
  await expect(items.nth(1)).toContainText('Codex 5.3')
}
