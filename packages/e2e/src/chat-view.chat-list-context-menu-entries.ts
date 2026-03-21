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
  const chatListItem = chatListItems.nth(0)
  // @ts-ignore
  const beforeClassName = await chatListItem.evaluate((node) => node.className)
  // @ts-ignore
  const beforeBoxShadow = await chatListItem.evaluate((node) => getComputedStyle(node).boxShadow)

  // act
  await Locator('.ChatList .ChatListItemLabel').nth(0).click({ button: 'right' })

  // assert
  const renameMenuItem = Locator('.MenuItem').nth(0)
  await expect(renameMenuItem).toBeVisible()
  await expect(renameMenuItem).toHaveText('Rename')
  const archiveMenuItem = Locator('.MenuItem').nth(1)
  await expect(archiveMenuItem).toBeVisible()
  await expect(archiveMenuItem).toHaveText('Archive')
  // @ts-ignore
  const afterClassName = await chatListItem.evaluate((node) => node.className)
  // @ts-ignore
  const afterBoxShadow = await chatListItem.evaluate((node) => getComputedStyle(node).boxShadow)
  if (beforeClassName.includes('ChatListItemFocused')) {
    throw new Error(`Expected chat list item to start unfocused, got class "${beforeClassName}"`)
  }
  if (!afterClassName.includes('ChatListItemFocused')) {
    throw new Error(`Expected chat list item to gain focused class after right click, got class "${afterClassName}"`)
  }
  if (afterBoxShadow === beforeBoxShadow) {
    throw new Error(`Expected focused border styling to change after right click, boxShadow stayed "${afterBoxShadow}"`)
  }
}
