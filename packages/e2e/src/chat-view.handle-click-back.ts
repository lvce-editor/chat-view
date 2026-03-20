import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-back'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-1', [])

  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  await expect(backButton).toBeVisible()

  // act
  await Chat.handleClickBack()

  // assert
  const chatList = Locator('.ChatList')
  await expect(chatList).toBeVisible()
  await expect(backButton).toHaveCount(0)
}
