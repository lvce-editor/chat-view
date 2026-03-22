import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-whitespace-tab'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  const sendButton = Locator('.IconButton[name="send"]')
  await expect(composer).toBeVisible()
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('disabled', '')

  // act
  await Chat.handleInput('\t')

  // assert
  await expect(composer).toHaveValue('\t')
  await expect(sendButton).toHaveAttribute('disabled', '')
}
