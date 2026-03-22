import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-open'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // act
  await Command.execute('Chat.openModelPicker')

  // assert
  const modelPicker = Locator('.ChatModelPicker')
  await expect(modelPicker).toBeVisible()
}
