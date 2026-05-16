import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-entries'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
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

  const menuItems = Locator('.MenuItem')
  const moreToggle = Locator('.ChatList .ChatListMoreToggleLabel')

  await expect(moreToggle).toHaveText('Show 2 More')

  await Chat.handleChatListContextMenu(0, 220)

  await expect(menuItems).toHaveCount(3)
  await expect(menuItems.nth(0)).toHaveText('Mark All as Read')
  await expect(menuItems.nth(1)).toHaveText('Archive All')
  await expect(menuItems.nth(2)).toHaveText('Collapse All')

  await Command.execute('Chat.handleInputFocus', 'chat-list')
  await Command.execute('Chat.handleClick', 'chat-list-show-more')
  await Chat.rerender()
  await expect(moreToggle).toHaveText('Show Less')

  await Chat.handleChatListContextMenu(0, 220)

  await expect(menuItems).toHaveCount(3)
  await expect(menuItems.nth(0)).toHaveText('Mark All as Read')
  await expect(menuItems.nth(1)).toHaveText('Archive All')
  await expect(menuItems.nth(2)).toHaveText('Collapse All')
}
