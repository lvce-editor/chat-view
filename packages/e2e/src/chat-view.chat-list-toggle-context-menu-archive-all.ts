import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-archive-all'

export const test: Test = async ({ Chat, Command, ContextMenu, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [], { projectId: 'project-1' })
  await Command.execute('Chat.openMockSession', 'Chat 2', [], { projectId: 'project-1' })
  await Command.execute('Chat.openMockSession', 'Chat 3', [], { projectId: 'project-1' })
  await Command.execute('Chat.openMockSession', 'Chat 4', [], { projectId: 'project-1' })
  await Command.execute('Chat.openMockSession', 'Chat 5', [], { projectId: 'project-1' })
  await Chat.rerender()
  await Chat.handleClickBack()
  await Chat.rerender()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const moreToggle = Locator('.ChatList .ChatListMoreToggleLabel')

  await expect(chatListItems).toHaveCount(3)
  await expect(moreToggle).toHaveCount(1)
  await expect(moreToggle).toHaveText('Show 2 More')

  await Chat.handleChatListContextMenu(0, 250)
  await ContextMenu.selectItem('Archive All')

  await expect(chatListItems).toHaveCount(0)
  await expect(moreToggle).toHaveCount(0)
}
