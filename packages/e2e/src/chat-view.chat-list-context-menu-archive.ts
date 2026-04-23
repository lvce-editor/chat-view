import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-archive'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('Archive Me', [
    {
      id: 'message-1',
      role: 'assistant',
      text: 'mock message',
      time: '10:00',
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(1)
  await expect(messages.nth(0)).toContainText('mock message')

  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const chatListLabels = Locator('.ChatListItemLabel')
  await expect(chatListItems).toHaveCount(1)
  await expect(chatListLabels.nth(0)).toHaveText('Archive Me')

  await Chat.handleChatListContextMenu(0, 70)

  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(archiveMenuItem).toBeVisible()
  await expect(archiveMenuItem).toHaveText('Archive')

  await archiveMenuItem.click()

  await expect(chatListItems).toHaveCount(0)
  await expect(chatListLabels).toHaveCount(0)
}
