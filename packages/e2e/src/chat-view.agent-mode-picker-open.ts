import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.agent-mode-picker-open'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openAgentModePicker')

  const picker = Locator('.ChatModelPicker')
  const items = Locator('.ChatModelPickerItem')

  await expect(picker).toBeVisible()
  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toHaveText('Agent')
  await expect(items.nth(1)).toHaveText('Plan')
}
