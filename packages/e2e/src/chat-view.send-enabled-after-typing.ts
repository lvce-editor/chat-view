import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-empty'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  const sendButton = Locator('.Button[name="send"]')
  await expect(composer).toBeVisible()
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('disabled', '')

  // act
  await composer.type('hello')

  // assert
  await expect(sendButton).toHaveAttribute('disabled', null)
}
