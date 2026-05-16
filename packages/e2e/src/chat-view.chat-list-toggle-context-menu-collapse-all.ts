import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-collapse-all'

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

  const sessionTitles = Locator('.ChatList .ChatListItemTitle')
  const moreToggle = Locator('.ChatList .ChatListMoreToggleLabel')

  await Command.execute('Chat.handleClick', 'chat-list-show-more')
  await Chat.rerender()
  await expect(sessionTitles).toHaveCount(5)
  await expect(moreToggle).toHaveText('Show Less')

  await Chat.handleChatListContextMenu(0, 220)
  await ContextMenu.selectItem('Collapse All')

  await Chat.rerender()
  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveText('Show 2 More')
}
