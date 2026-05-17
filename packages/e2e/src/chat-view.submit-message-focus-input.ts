import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.submit-message-focus-input'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  await expect(composer).toBeFocused()
}
