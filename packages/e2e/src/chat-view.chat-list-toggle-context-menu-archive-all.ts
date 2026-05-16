import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-archive-all'

export const test: Test = async ({ Chat, Command, ContextMenu, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [])
  await Command.execute('Chat.openMockSession', 'Chat 2', [])
  await Command.execute('Chat.openMockSession', 'Chat 3', [])
  await Command.execute('Chat.openMockSession', 'Chat 4', [])
  await Command.execute('Chat.openMockSession', 'Chat 5', [])
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  await expect(chatListItems).toHaveCount(3)
  await expect(moreToggle).toHaveCount(1)

  await Chat.handleChatListContextMenu(0, 220)
  await ContextMenu.selectItem('Archive All')

  await expect(chatListItems).toHaveCount(0)
  await expect(moreToggle).toHaveCount(0)
}
