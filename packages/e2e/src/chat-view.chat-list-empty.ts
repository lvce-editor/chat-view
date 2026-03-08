import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-empty'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.reset')

  // assert
  const list = Locator('.ChatListEmpty')
  await expect(list).toBeVisible()
}
