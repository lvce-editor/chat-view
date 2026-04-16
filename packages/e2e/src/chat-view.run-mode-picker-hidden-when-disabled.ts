import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-hidden-when-disabled'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const runModePickerToggle = Locator('.ChatSendArea button.ChatSelect[name="run-mode-picker-toggle"]')
  await expect(runModePickerToggle).toBeVisible()

  await Command.execute('Chat.setShowRunMode', false)
  await Chat.rerender()

  await expect(runModePickerToggle).toHaveCount(0)
}
