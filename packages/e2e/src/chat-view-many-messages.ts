import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.one-message'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // act
  const messages = Locator('.ChatMessages .Message')
  for (let i = 0; i < 20; i++) {
    await Chat.handleInput('hello from e2e')
    await Chat.handleSubmit()
    // const firstMessage = messages.nth(i * 2)
    // await expect(firstMessage).toHaveText('hello from e2e')
    // const secondMessage = messages.nth(i * 2 - 1)
    // await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
  }

  // assert
  await expect(messages).toHaveCount(40)
}
