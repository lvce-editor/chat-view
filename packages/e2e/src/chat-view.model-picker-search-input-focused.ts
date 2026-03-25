import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-input-focused'

export const skip = true

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // act
  await Command.execute('Chat.openModelPicker')

  // assert
  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await expect(searchInput).toBeVisible()
  await expect(searchInput).toBeFocused()
}
