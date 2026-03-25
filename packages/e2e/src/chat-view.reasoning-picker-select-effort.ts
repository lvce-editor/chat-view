import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.reasoning-picker-select-effort'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setReasoningPickerEnabled', true)
  await Command.execute('Chat.setReasoningEffort', 'extra-high')
  await Command.execute('Chat.rerender')

  const reasoningPickerToggle = Locator('.ChatSendArea button.Select[name="reasoning-effort-picker-toggle"]')
  await expect(reasoningPickerToggle).toBeVisible()
  await expect(reasoningPickerToggle).toContainText('Extra High')
}
