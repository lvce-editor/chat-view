import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-close'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const closeButton = Locator('[name="close-chat"]')

  // act
  // eslint-disable-next-line e2e/no-direct-click
  await closeButton.click()

  // assert
  const chat = Locator('.Chat')
  await expect(chat).toBeHidden()
}
