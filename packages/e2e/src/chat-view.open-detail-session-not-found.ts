import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.open-detail-session-not-found'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setChatList', 1)

  // act
  await Command.execute('Chat.handleClick', 'session:session-does-not-exist')

  // assert
  const notFoundMessage = Locator('text=Session could not be found')
  await expect(notFoundMessage).toBeVisible()
}
