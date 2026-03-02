import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-close'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')

  // act
  await Command.execute('Chat.handleClickClose')

  // assert
  const chat = Locator('.Chat')
  await expect(chat).toBeHidden()
}
