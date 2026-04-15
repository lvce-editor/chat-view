import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.select-chevron-setting'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const modelPickerToggle = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  const agentModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="agent-mode-picker-toggle"]')
  const runModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="run-mode-picker-toggle"]')
  const modelPickerChevron = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"] .MaskIcon')
  const agentModePickerChevron = Locator('.ChatSendArea button.ChatSelect[name="agent-mode-picker-toggle"] .MaskIcon')
  const runModePickerChevron = Locator('.ChatSendArea button.ChatSelect[name="run-mode-picker-toggle"] .MaskIcon')

  await expect(modelPickerToggle).toContainText('test')
  await expect(agentModePickerToggle).toContainText('ask')
  await expect(runModePickerToggle).toContainText('local')
  await expect(modelPickerChevron).toHaveCount(1)
  await expect(agentModePickerChevron).toHaveCount(1)
  await expect(runModePickerChevron).toHaveCount(1)

  await Command.execute('Chat.setSelectChevronEnabled', false)

  await expect(modelPickerToggle).toContainText('test')
  await expect(agentModePickerToggle).toContainText('ask')
  await expect(runModePickerToggle).toContainText('local')
  await expect(modelPickerChevron).toHaveCount(0)
  await expect(agentModePickerChevron).toHaveCount(0)
  await expect(runModePickerChevron).toHaveCount(0)
}
