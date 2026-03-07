import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-line-1'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Command.execute('Chat.enterNewLine')

  // assert
  // TODO verify height
}
