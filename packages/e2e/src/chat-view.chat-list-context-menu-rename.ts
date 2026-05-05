import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-rename'

export const test: Test = async ({ Chat, ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const chatListLabels = Locator('.ChatListItemLabel')
  await expect(chatListItems).toHaveCount(1)
  await expect(chatListLabels).toHaveText('Chat 1')

  await Chat.handleChatListContextMenu(0, 70)
  await ContextMenu.selectItem('Rename')

  const renameInput = Locator('.InputBox[name="QuickPickInput"]')
  await expect(renameInput).toBeVisible()
  await expect(renameInput).toHaveValue('Chat 1')

  await renameInput.fill('Renamed Chat')
  await renameInput.press('Enter')

  await expect(chatListItems).toHaveCount(1)
  await expect(chatListLabels).toHaveText('Renamed Chat')
}