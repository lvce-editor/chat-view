import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.open-detail'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.reset')

  // act
  await Command.execute('Chat.openMockSession', 'session-1', [])

  // assert
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  await expect(backButton).toBeVisible()
}
