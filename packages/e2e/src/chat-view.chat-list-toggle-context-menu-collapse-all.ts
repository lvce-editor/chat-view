import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-toggle-context-menu-collapse-all'

export const test: Test = async ({ Chat, Command, ContextMenu, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [])
  await Command.execute('Chat.openMockSession', 'Chat 2', [])
  await Command.execute('Chat.openMockSession', 'Chat 3', [])
  await Command.execute('Chat.openMockSession', 'Chat 4', [])
  await Command.execute('Chat.openMockSession', 'Chat 5', [])
  await Chat.handleClickBack()

  const sessionTitles = Locator('.ChatList .ChatListItemTitle')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  await Command.execute('Chat.handleClick', 'chat-list-show-more')
  await expect(sessionTitles).toHaveCount(5)
  await expect(moreToggle).toHaveText('Show Less')

  await Chat.handleChatListContextMenu(0, 220)
  await ContextMenu.selectItem('Collapse All')

  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveText('Show 2 More')
}