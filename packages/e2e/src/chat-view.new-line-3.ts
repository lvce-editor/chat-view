import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-3'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.enterNewLine')
  await Command.execute('Chat.enterNewLine')

  // act
  await Command.execute('Chat.enterNewLine')

  // assert
  const input = Locator('.Chat .MultilineInputBox')
  await expect(input).toHaveCSS('height', '88px')
}
