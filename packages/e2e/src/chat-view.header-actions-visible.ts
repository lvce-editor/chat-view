import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.header-actions-visible'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // assert
  const sessionDebugButton = Locator('.ChatHeader .IconButton[name="session-debug"]')
  const createSessionButton = Locator('.ChatHeader .IconButton[name="create-session"]')
  const settingsButton = Locator('.ChatHeader .IconButton[name="settings"]')
  const closeChatButton = Locator('.ChatHeader .IconButton[name="close-chat"]')
  await expect(sessionDebugButton).toBeVisible()
  await expect(createSessionButton).toBeVisible()
  await expect(settingsButton).toBeVisible()
  await expect(closeChatButton).toBeVisible()
}
