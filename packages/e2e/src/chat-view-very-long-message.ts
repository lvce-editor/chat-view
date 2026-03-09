import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.very-long-message'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  const message = 'a'.repeat(3_000_000)
  await Command.execute('Chat.handleInput', 'composer', message, 'script')

  // act
  await Command.execute('Chat.handleSubmit')

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText(message)
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText(`Mock AI response: I received "${message}".`)
}
