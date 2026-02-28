import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-chat'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.reset')

  // act
  await Command.execute('Chat.handleClickNew')

  // assert
  const title = Locator('.ChatListItemLabel')
  await expect(title).toHaveText('Chat 1')
  await expect(composer).toBeVisible()
}
