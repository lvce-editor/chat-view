import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-chat'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  const title = Locator('.ChatListItemLabel')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Chat.handleClickNew()

  // assert
  await expect(composer).toBeVisible()
  await expect(composer).toBeFocused()
  await expect(title).toHaveCount(0)

  await Chat.handleInput('hello from first message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  await expect(title).toHaveText('Chat 1')
}
