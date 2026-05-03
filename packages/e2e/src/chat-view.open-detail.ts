import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.open-detail'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Chat.openMockSession('session-1', [])

  // assert
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  await expect(backButton).toBeVisible()
}
