import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-100'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Chat.handleInput('\n'.repeat(100))

  // assert
  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toHaveCSS('height', '178px')
}
