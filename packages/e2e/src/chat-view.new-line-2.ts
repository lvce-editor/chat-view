import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-2'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.enterNewLine()

  // act
  await Chat.enterNewLine()

  // assert
  const input = Locator('.Chat .ChatInputBox')
  await expect(input).toHaveCSS('height', '66px')
  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toHaveCSS('height', '136px')
}
