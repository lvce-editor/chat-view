import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-input-context-menu-entries'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Command.execute('Chat.handleChatInputContextMenu', 0, 0)

  // assert
  const renameMenuItem = Locator('.MenuItem:has-text("Rename")')
  const archiveMenuItem = Locator('.MenuItem:has-text("Archive")')
  await expect(renameMenuItem).toBeVisible()
  await expect(archiveMenuItem).toBeVisible()
}
