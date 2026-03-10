import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.delete-session'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('new session message')
  await Chat.handleSubmit()

  const sessionId = await Chat.getSelectedSessionId()

  // console.log({ sessionId })

  // const createdSessionItem = Locator(`.ChatList .ChatListItem[name="session:${createdSessionId}"]`)
  // await expect(createdSessionItem).toHaveCount(1)

  // await Command.execute('Chat.handleClickBack')
  // await Command.execute('Chat.handleClickDelete', createdSessionId)

  // const afterDelete = (await Command.execute('Chat.saveState')) as SavedState
  // if (afterDelete.selectedSessionId === createdSessionId) {
  //   throw new Error('expected selected session to change after deletion')
  // }

  // const deletedSessionItem = Locator(`.ChatList .ChatListItem[name="session:${createdSessionId}"]`)
  // await expect(deletedSessionItem).toHaveCount(0)

  // const chatListItems = Locator('.ChatList .ChatListItem')
  // await expect(chatListItems).toHaveCount(1)
}
