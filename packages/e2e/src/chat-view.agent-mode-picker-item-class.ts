import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.agent-mode-picker-item-class'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.handleClick', 'agent-mode-picker-toggle')

  const listItems = Locator('.ChatOverlays ul.ChatModelPickerList > li.ChatModelPickerItem')
  const selectedListItem = Locator('.ChatOverlays ul.ChatModelPickerList > li.ChatModelPickerItemSelected')

  await expect(listItems).toHaveCount(2)
  await expect(listItems.nth(0)).toHaveText('Agent')
  await expect(listItems.nth(1)).toHaveText('Plan')
  await expect(selectedListItem).toHaveCount(1)
  await expect(selectedListItem).toHaveText('Agent')
}
