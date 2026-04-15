import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.select-chevron-setting'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const modelPickerToggle = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  const modelPickerChevron = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"] .MaskIconChevronDown')

  await expect(modelPickerToggle).toBeVisible()
  await expect(modelPickerChevron).toHaveCount(1)

  await Command.execute('Chat.setRenderSelectChevrons', false)
  await Chat.rerender()

  await expect(modelPickerToggle).toContainText('test')
  await expect(modelPickerChevron).toHaveCount(0)
}
