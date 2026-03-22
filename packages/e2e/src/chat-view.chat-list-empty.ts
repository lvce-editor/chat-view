import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-empty'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // assert
  const list = Locator('.ChatListEmpty')
  await expect(list).toBeVisible()
}
