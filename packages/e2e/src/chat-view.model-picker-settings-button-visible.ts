import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-settings-button-visible'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)
  await Locator('.ChatSendArea .Select[name="model-picker-toggle"]').click()

  const settingsButton = Locator('.ChatModelPicker .IconButton[name="model-picker-settings"]')
  await expect(settingsButton).toBeVisible()
}
