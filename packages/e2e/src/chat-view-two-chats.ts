import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.two-chats'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  // act
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  // assert
  const item = Locator('.ChatListItem')
  await expect(item).toHaveCount(2)
}
