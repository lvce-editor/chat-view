import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-empty'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  const sendButton = Locator('.Button[name="send"]')
  await expect(composer).toBeVisible()
  await expect(sendButton).toBeVisible()

  // assert
  await expect(sendButton).toHaveAttribute('disabled', '')
}
