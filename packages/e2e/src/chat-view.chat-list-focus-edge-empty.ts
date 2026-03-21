import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-focus-edge-empty'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.deleteSessionAtIndex', 0)
  await Command.execute('Chat.chatListFocusFirst')
  await Command.execute('Chat.chatListFocusNext')
  await Command.execute('Chat.chatListFocusPrevious')
  await Command.execute('Chat.chatListFocusLast')

  const focusedItem = Locator('.ChatList .ChatListItemFocused')
  await expect(focusedItem).toHaveCount(0)
  const emptyList = Locator('.ChatListEmpty')
  await expect(emptyList).toBeVisible()
}
