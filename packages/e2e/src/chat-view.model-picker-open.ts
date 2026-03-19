import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-open'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)

  const modelPickerToggle = Locator('.ChatSendArea .Select[name="model-picker-toggle"]')
  await modelPickerToggle.click()

  const modelPicker = Locator('.ChatModelPicker')
  await expect(modelPicker).toBeVisible()
}
