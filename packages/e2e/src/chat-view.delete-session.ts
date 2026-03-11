import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.delete-session'

interface SavedState {
  readonly selectedSessionId: string
  readonly viewMode: string
}

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  const chatListItems = Locator('.ChatList .ChatListItem')
  await Chat.handleInput('first session message')
  await Chat.handleSubmit()
  const firstSessionId = await Chat.getSelectedSessionId()
  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(1)

  // act
  await Command.execute('Chat.handleClickDelete', firstSessionId)

  // assert
  await expect(chatListItems).toHaveCount(0)
}
