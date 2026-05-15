import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-new-empty-session-title'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const label = Locator('.ChatListItemLabel')

  // act
  await Chat.handleClickNew()

  // assert
  await expect(label).toHaveCount(0)

  await Chat.handleInput('hello from first message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  await expect(label).toHaveText('Chat 1')
}
