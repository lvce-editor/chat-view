import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.composer-placeholder'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')

  // assert
  await expect(composer).toHaveAttribute('placeholder', 'Type your message. Enter to send, Shift+Enter for newline.')
}
