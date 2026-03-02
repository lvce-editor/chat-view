import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.delete-session'

export const skip = 1

type SavedState = {
  readonly selectedSessionId: string
}

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.handleInput', 'new session message', 'script')
  await Command.execute('Chat.handleSubmit')

  const afterCreate = (await Command.execute('Chat.saveState')) as SavedState
  const createdSessionId = afterCreate.selectedSessionId
  if (!createdSessionId) {
    throw new Error('expected created session id')
  }

  const createdSessionItem = Locator(`.ChatList .ChatListItem[name="session:${createdSessionId}"]`)
  await expect(createdSessionItem).toHaveCount(1)

  await Command.execute('Chat.handleClickBack')
  await Command.execute('Chat.handleClickDelete', createdSessionId)

  const afterDelete = (await Command.execute('Chat.saveState')) as SavedState
  if (afterDelete.selectedSessionId === createdSessionId) {
    throw new Error('expected selected session to change after deletion')
  }

  const deletedSessionItem = Locator(`.ChatList .ChatListItem[name="session:${createdSessionId}"]`)
  await expect(deletedSessionItem).toHaveCount(0)

  const chatListItems = Locator('.ChatList .ChatListItem')
  await expect(chatListItems).toHaveCount(1)
}
