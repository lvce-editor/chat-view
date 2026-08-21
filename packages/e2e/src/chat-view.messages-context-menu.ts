import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.messages-context-menu'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('context menu target message')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages')
  await expect(messages).toBeVisible()

  const firstMessage = Locator('.ChatMessages .Message').nth(0)
  // eslint-disable-next-line e2e/no-direct-click
  await firstMessage.click({ button: 'right' })

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
