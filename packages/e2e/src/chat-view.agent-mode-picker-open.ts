import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.agent-mode-picker-open'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const agentModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="agent-mode-picker-toggle"]')
  const nativeAgentModePicker = Locator('.ChatSendArea select.Select[name="agent-mode"]')
  await expect(agentModePickerToggle).toBeVisible()
  await expect(nativeAgentModePicker).toHaveCount(0)
  await Chat.openAgentModePicker()

  const picker = Locator('.ChatModelPicker')
  const items = Locator('.ChatModelPickerItem')

  await expect(picker).toBeVisible()
  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toHaveText('Agent')
  await expect(items.nth(1)).toHaveText('Plan')
}
