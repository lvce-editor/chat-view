import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-visible-by-default'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const runModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="run-mode-picker-toggle"]')
  const nativeRunModePicker = Locator('.ChatSendArea select.Select[name="runMode"]')
  await expect(runModePickerToggle).toBeVisible()
  await expect(runModePickerToggle).toContainText('local')
  await expect(nativeRunModePicker).toHaveCount(0)
}
