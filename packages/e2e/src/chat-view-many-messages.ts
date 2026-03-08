import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.one-message'

export const skip = 1
export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')

  // act
  const messages = Locator('.ChatMessages .Message')
  for (let i = 0; i < 20; i++) {
    await Command.execute('Chat.handleInput', 'composer', 'hello from e2e', 'script')
    await Command.execute('Chat.handleSubmit')
    // const firstMessage = messages.nth(i * 2)
    // await expect(firstMessage).toHaveText('hello from e2e')
    // const secondMessage = messages.nth(i * 2 - 1)
    // await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
  }

  // assert
  await expect(messages).toHaveCount(40)
}
