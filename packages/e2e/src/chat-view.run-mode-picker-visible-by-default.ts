import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-visible-by-default'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const runModePickerToggle = Locator('.ChatSendArea button.Select[name="run-mode-picker-toggle"]')
  const nativeRunModePicker = Locator('.ChatSendArea select.Select[name="runMode"]')
  await expect(runModePickerToggle).toBeVisible()
  await expect(runModePickerToggle).toContainText('local')
  await expect(nativeRunModePicker).toHaveCount(0)

  await Command.execute('Chat.handleClick', 'run-mode-picker-toggle')
  const backgroundOption = Locator('.ChatSendArea .ChatModelPickerItem[name="run-mode-picker-item:background"]')
  await expect(backgroundOption).toBeVisible()
  await backgroundOption.click()

  await expect(runModePickerToggle).toContainText('background')
  await expect(backgroundOption).toHaveCount(0)
}
