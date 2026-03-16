import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.submit-message'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.first()).toContainText('hello from e2e')
}
