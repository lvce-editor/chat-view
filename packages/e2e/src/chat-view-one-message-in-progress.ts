import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.one-message-in-progress'

export const test: Test = async ({ Chat, expect, Locator, Command }) => {
  // arrange
  await Chat.show()
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveClass('MessageUser')
  await expect(firstMessage).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveClass('MessageAssistant')
  await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
  await Command.execute('Chat.setInProgress', true)
}
