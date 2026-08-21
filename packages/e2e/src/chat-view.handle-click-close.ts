import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-close'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // act
  await Chat.handleClickClose()

  // assert
  const chat = Locator('.Chat')
  await expect(chat).toBeHidden()
}
