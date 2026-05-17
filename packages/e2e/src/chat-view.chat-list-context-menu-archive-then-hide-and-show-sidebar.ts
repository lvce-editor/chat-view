import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-archive-then-hide-and-show-sidebar'

export const test: Test = async ({ Chat, Command, ContextMenu, expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
  await Chat.handleClickBack()
  const chatListItems = Locator('.ChatList .ChatListItem')
  await Chat.handleChatListContextMenu(0, 70)
  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(archiveMenuItem).toBeVisible()
  await expect(archiveMenuItem).toHaveText('Archive')
  await ContextMenu.selectItem('Archive')
  await Command.execute('Layout.hideSecondarySideBar')

  // act
  await Command.execute('Layout.showSecondarySideBar')
  await Chat.show()

  // assert
  await expect(chatListItems).toHaveCount(0)
}
