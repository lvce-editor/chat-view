import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.messages-context-menu'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('context menu target message')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages')
  await expect(messages).toBeVisible()

  await Command.execute('Chat.handleMessagesContextMenu', 0, 0, 0)

  const cutMenuItem = Locator('.MenuItem').nth(0)
  await expect(cutMenuItem).toBeVisible()
  await expect(cutMenuItem).toHaveText('Cut')

  const copyMenuItem = Locator('.MenuItem').nth(1)
  await expect(copyMenuItem).toBeVisible()
  await expect(copyMenuItem).toHaveText('Copy')

  const pasteMenuItem = Locator('.MenuItem').nth(2)
  await expect(pasteMenuItem).toBeVisible()
  await expect(pasteMenuItem).toHaveText('Paste')
}
