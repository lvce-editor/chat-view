import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-2'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.enterNewLine()

  // act
  await Chat.enterNewLine()

  // assert
  const input = Locator('.Chat .MultilineInputBox')
  await expect(input).toHaveCSS('height', '68px')
}
