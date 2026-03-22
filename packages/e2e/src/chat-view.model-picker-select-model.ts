import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-select-model'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNewChatModelPickerEnabled', true)

  const toggleButton = Locator('.ChatSendArea div.Select[name="model-picker-toggle"]')
  await toggleButton.click()
  await Locator('.ChatModelPicker .ChatModelPickerItem[name="model-picker-item:openapi/gpt-4.1-mini"]').click()

  await expect(Locator('.ChatModelPicker')).toHaveCount(0)
  await expect(toggleButton).toContainText('GPT-4.1 Mini')
}
