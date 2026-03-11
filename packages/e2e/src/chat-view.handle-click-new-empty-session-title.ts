import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-new-empty-session-title'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const headerTitle = Locator('.ChatHeader .ChatName .Label')

  // act
  await Chat.handleClickNew()

  // assert
  await expect(headerTitle).toHaveText('Chat 1')
}
