import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.messages-log-role'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages')
  await expect(messages).toHaveAttribute('role', 'log')
}
