import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-no-matching-models'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)
  await Locator('.ChatSendArea button.Select[name="model-picker-toggle"]').click()

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(17)

  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await searchInput.type('not-found-query')

  await expect(items).toHaveCount(1)
  await expect(items.nth(0)).toContainText('No matching models have been found.')
}
