import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-chat'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Chat.handleClickNew()

  // assert
  const title = Locator('.ChatListItemLabel')
  await expect(title).toHaveText('Chat 1')
  await expect(composer).toBeVisible()
}
