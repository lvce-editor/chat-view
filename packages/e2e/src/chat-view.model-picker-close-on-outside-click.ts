import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-close-on-outside-click'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Chat.openModelPicker()
  const modelPicker = Locator('.ChatModelPicker')
  const composer = Locator('[name="composer"]')
  await expect(modelPicker).toBeVisible()

  await Command.execute('Chat.handleClickModelPickerOverlay')

  await expect(modelPicker).toHaveCount(0)
  await expect(composer).toBeFocused()
}
