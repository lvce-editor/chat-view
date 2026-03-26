import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-entries'
// export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('context menu target message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()
  const chatListItems = Locator('.ChatList .ChatListItem')
  await expect(chatListItems).toHaveCount(1)

  // act
  await Chat.handleChatListContextMenu(0, 70)

  // assert
  const renameMenuItem = Locator('.MenuItem').nth(0)
  await expect(renameMenuItem).toBeVisible()
  await expect(renameMenuItem).toHaveText('Rename')
  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(archiveMenuItem).toBeVisible()
  await expect(archiveMenuItem).toHaveText('Archive')
}
