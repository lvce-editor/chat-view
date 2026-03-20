import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-3'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  for (let i = 0; i < 3; i++) {
    await Chat.enterNewLine()
  }

  // assert
  const input = Locator('.Chat .ChatInputBox')
  await expect(input).toHaveCSS('height', '94px')
  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toHaveCSS('height', '164px')
}
