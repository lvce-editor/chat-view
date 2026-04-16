import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-area-content-top-visible'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const sendAreaContentTop = Locator('.ChatSendAreaContentTop')
  await expect(sendAreaContentTop).toBeVisible()
}
