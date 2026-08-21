import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-input-context-menu-entries'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  // eslint-disable-next-line e2e/no-direct-click
  await composer.click({ button: 'right' })

  // assert
  const renameMenuItem = Locator('.MenuItem').nth(0)
  await expect(renameMenuItem).toBeVisible()
  await expect(renameMenuItem).toHaveText('Cut')
  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(archiveMenuItem).toBeVisible()
  await expect(archiveMenuItem).toHaveText('Copy')
  const item3 = Locator('.MenuItem').nth(2)
  await expect(item3).toBeVisible()
  await expect(item3).toHaveText('Paste')
}
