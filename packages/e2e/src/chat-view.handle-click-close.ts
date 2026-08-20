import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-close'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const closeButton = Locator('[name="close-chat"]')

  // act
  await closeButton.click()

  // assert
  const chat = Locator('.Chat')
  await expect(chat).toBeHidden()
}
