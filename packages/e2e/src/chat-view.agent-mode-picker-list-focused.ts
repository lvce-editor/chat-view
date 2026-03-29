import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.agent-mode-picker-list-focused'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const agentModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="agent-mode-picker-toggle"]')
  await expect(agentModePickerToggle).toBeVisible()
  await Command.execute('Chat.handleClick', 'agent-mode-picker-toggle')

  const picker = Locator('.ChatOverlays .ChatModelPicker')
  const pickerList = Locator('.ChatOverlays ul.ChatModelPickerList')
  await expect(picker).toBeVisible()
  await expect(pickerList).toHaveAttribute('tabindex', '-1')
  await expect(pickerList).toBeFocused()
}
