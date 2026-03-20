import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-focus-last'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleClickNew()
  await Chat.handleClickBack()
  await Chat.handleClickNew()
  await Chat.handleClickBack()

  await Command.execute('Chat.chatListFocusLast')

  const focusedItem = Locator('.ChatList .ChatListItemFocused')
  await expect(focusedItem).toHaveCount(1)
  await expect(focusedItem.nth(0)).toContainText('Chat 3')
}
