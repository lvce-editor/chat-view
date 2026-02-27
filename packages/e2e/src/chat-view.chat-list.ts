import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)

  const sessionA = Locator('.ChatList .Button[name="session:session-a"]')
  await expect(sessionA).toBeVisible()

  const sessionB = Locator('.ChatList .Button[name="session:session-b"]')
  await expect(sessionB).toBeVisible()

  const sessionC = Locator('.ChatList .Button[name="session:session-c"]')
  await expect(sessionC).toBeVisible()
}
