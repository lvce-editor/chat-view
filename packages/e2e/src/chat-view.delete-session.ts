import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.delete-session'

interface SavedState {
  readonly selectedSessionId: string
  readonly viewMode: string
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const chatListItems = Locator('.ChatList .ChatListItem')
  await expect(composer).toBeVisible()

  // Create two independent sessions so deleting one can be validated thoroughly.
  await Chat.handleInput('first session message')
  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')
  const firstSessionId = await Chat.getSelectedSessionId()

  await Chat.handleClickNew()
  await Chat.handleInput('second session message')
  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const secondSessionId = await Chat.getSelectedSessionId()

  if (firstSessionId === secondSessionId) {
    throw new Error('expected second submit to create/select a different session')
  }

  await expect(chatListItems).toHaveCount(2)
  await expect(backButton).toBeVisible()

  // act
  await Command.execute('Chat.handleClickDelete', secondSessionId)
  await Command.execute('Chat.rerender')

  // assert state switched back to the remaining session in detail mode
  const afterDelete = (await Command.execute('Chat.saveState')) as SavedState
  if (afterDelete.selectedSessionId !== firstSessionId) {
    throw new Error('expected selected session to switch to remaining session after delete')
  }
  if (afterDelete.viewMode !== 'detail') {
    throw new Error(`expected to stay in detail mode after deleting selected session, got ${afterDelete.viewMode}`)
  }

  // assert detail content switched to the remaining session
  const chatDetailsContent = Locator('.ChatDetailsContent')
  await expect(chatDetailsContent).toContainText('first session message')
  await expect(chatDetailsContent).not.toContainText('second session message')

  // assert list no longer contains the deleted session
  await Command.execute('Chat.handleClickBack')
  await expect(backButton).toHaveCount(0)
  const remainingSessionItem = Locator(`.ChatList .ChatListItem[name="session:${firstSessionId}"]`)
  const deletedSessionItem = Locator(`.ChatList .ChatListItem[name="session:${secondSessionId}"]`)
  await expect(remainingSessionItem).toHaveCount(1)
  await expect(deletedSessionItem).toHaveCount(0)
  await expect(chatListItems).toHaveCount(1)
}
