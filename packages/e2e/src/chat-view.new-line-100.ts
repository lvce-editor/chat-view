import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-1'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  for (let i = 0; i < 100; i++) {
    await Chat.enterNewLine()
  }

  // assert

  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toHaveCSS('height', '178px')
  // TODO verify height
}
