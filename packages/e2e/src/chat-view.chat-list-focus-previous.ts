import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-focus-previous'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleClickNew()
  await Chat.handleClickBack()
  await Chat.handleClickNew()
  await Chat.handleClickBack()

  await Command.execute('Chat.handleInputFocus', 'chat-list')
  await Command.execute('Chat.chatListFocusPrevious')

  const focusedItem = Locator('.ChatList .ChatListItemFocused')
  await expect(focusedItem).toHaveCount(1)
  await expect(focusedItem.nth(0)).toContainText('Chat 3')
}
