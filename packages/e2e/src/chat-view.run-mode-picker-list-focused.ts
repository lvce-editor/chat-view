import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-list-focused'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const runModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="run-mode-picker-toggle"]')
  await expect(runModePickerToggle).toBeVisible()
  await Command.execute('Chat.handleClick', 'run-mode-picker-toggle')

  const picker = Locator('.ChatOverlays .ChatModelPicker')
  const pickerList = Locator('.ChatOverlays ul.ChatModelPickerList')
  await expect(picker).toBeVisible()
  await expect(pickerList).toHaveAttribute('tabindex', '-1')
  await expect(pickerList).toBeFocused()
}
