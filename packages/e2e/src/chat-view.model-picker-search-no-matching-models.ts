import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-no-matching-models'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(21)

  // act
  await Command.execute(`Chat.handleInput`, 'model-picker-search', 'not-found-query')

  // assert
  const message = Locator('.Message')
  await expect(message).toHaveText('No matching models have been found.')
}
