import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-3'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.enterNewLine()
  await Chat.enterNewLine()

  // act
  await Chat.enterNewLine()

  // assert
  const input = Locator('.Chat .MultilineInputBox')
  await expect(input).toHaveCSS('height', '94px')
  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toHaveCSS('height', '164px')
}
