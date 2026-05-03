import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-close-on-outside-click'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Chat.openModelPicker()
  await expect(Locator('.ChatModelPicker')).toBeVisible()

  await Command.execute('Chat.handleClickModelPickerOverlay')

  await expect(Locator('.ChatModelPicker')).toHaveCount(0)
  await expect(Locator('[name="composer"]')).toBeFocused()
}
