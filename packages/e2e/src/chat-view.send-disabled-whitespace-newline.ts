import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-whitespace-newline'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  const sendButton = Locator('.IconButton[name="send"]')
  await expect(composer).toBeVisible()
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('disabled', '')

  // act
  await Chat.handleInput('\n')

  // assert
  await expect(composer).toHaveValue('\n')
  await expect(sendButton).toHaveAttribute('disabled', '')
}
