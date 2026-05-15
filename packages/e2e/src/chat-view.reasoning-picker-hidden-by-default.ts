import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.reasoning-picker-hidden-by-default'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const reasoningPickerToggle = Locator('.ChatSendArea button.ChatSelect[name="reasoning-effort-picker-toggle"]')
  await expect(reasoningPickerToggle).toHaveCount(0)

  await Command.execute('Chat.setReasoningPickerEnabled', true)
  await Chat.rerender()

  await expect(reasoningPickerToggle).toBeVisible()
  await expect(reasoningPickerToggle).toContainText('High')
}
