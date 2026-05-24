import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-mark-all-read'

export const test: Test = async ({ Chat, Command, ContextMenu, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [], { projectId: 'project-1', unread: true })
  await Command.execute('Chat.openMockSession', 'Chat 2', [], { projectId: 'project-1', unread: true })
  await Command.execute('Chat.openMockSession', 'Chat 3', [], { projectId: 'project-1', unread: true })
  await Command.execute('Chat.openMockSession', 'Chat 4', [], { projectId: 'project-1', unread: true })
  await Command.execute('Chat.openMockSession', 'Chat 5', [], { projectId: 'project-1', unread: true })
  await Chat.rerender()
  await Chat.handleClickBack()
  await Chat.rerender()

  const unreadItems = Locator('.ChatList .ChatListItem.ChatListItemUnread')

  await expect(unreadItems).toHaveCount(5)

  await Chat.handleChatListContextMenu(0, 250)
  await ContextMenu.selectItem('Mark All as Read')

  await expect(unreadItems).toHaveCount(0)
}
