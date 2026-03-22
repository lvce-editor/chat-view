import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-open'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)

<<<<<<< HEAD
  const modelPickerToggle = Locator('.ChatSendArea button.Select[name="model-picker-toggle"]')
  await modelPickerToggle.click()
=======
  // act
  await Command.execute('Chat.openModelPicker')
>>>>>>> origin/main

  // assert
  const modelPicker = Locator('.ChatModelPicker')
  await expect(modelPicker).toBeVisible()
}
