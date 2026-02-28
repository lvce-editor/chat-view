import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-empty'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
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
