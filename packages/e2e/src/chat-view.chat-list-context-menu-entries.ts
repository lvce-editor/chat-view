import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-entries'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()
  await Chat.handleInput('context menu target message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  await expect(chatListItems).toHaveCount(1)

  // act
  await chatListItems.click({
    button: 'right',
  })

  // assert
  const renameMenuItem = Locator('.MenuItem:has-text("Rename")')
  const archiveMenuItem = Locator('.MenuItem:has-text("Archive")')
  await expect(renameMenuItem).toBeVisible()
  await expect(archiveMenuItem).toBeVisible()
}
