import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-header-context-menu-entries'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()

  // act
  await Command.execute('Chat.handleChatHeaderContextMenu', 0, 0)

  // assert
  const renameMenuItem = Locator('.MenuItem').nth(0)
  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(renameMenuItem).toBeVisible()
  await expect(archiveMenuItem).toBeVisible()
}
