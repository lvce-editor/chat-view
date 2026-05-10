import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.three-messages'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(6)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
}
