import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.welcome-message-default'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // assert
  const welcomeMessage = Locator('.ChatWelcomeMessage')
  await expect(welcomeMessage).toBeVisible()
}
