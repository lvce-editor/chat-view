import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.delete-session'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  const chatListItems = Locator('.ChatList .ChatListItem')
  await Chat.handleInput('first session message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(1)

  // act
  await Chat.deleteSessionAtIndex(0)

  // assert
  await expect(chatListItems).toHaveCount(0)
}
