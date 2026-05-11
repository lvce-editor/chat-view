import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.very-long-message'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const message = 'a'.repeat(3_000_000)
  await Chat.handleInput(message)

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText(message)
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText(`Mock AI response: I received "${message}".`)
}
