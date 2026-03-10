import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.open-detail-session-not-found'

export const test: Test = async ({ Chat, Command }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // act
  await Command.execute('Chat.handleClick', 'session:session-does-not-exist')

  // assert
  // TODO
  // const notFoundMessage = Locator('text=Session could not be found')
  // await expect(notFoundMessage).toBeVisible()
}
