import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-input'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')

  // act
  await Command.execute('Chat.handleClickClose')
  const chat = Locator('.Chat')
  await expect(chat).toBeHidden()
}
