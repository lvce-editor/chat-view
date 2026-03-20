import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.header-label'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // assert
  const label = Locator('.ChatHeader .Label')
  await expect(label).toHaveText('Chats')
  await expect(label).toHaveCSS('text-decoration', 'underline')
  await expect(label).toHaveCSS('text-decoration-underline-offset', '4px')
}
