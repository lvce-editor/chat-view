import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)

  const sessionA = Locator('.ChatList .ChatListItem[name="session:session-a"]')
  await expect(sessionA).toBeVisible()

  const sessionB = Locator('.ChatList .ChatListItem[name="session:session-b"]')
  await expect(sessionB).toBeVisible()

  const sessionC = Locator('.ChatList .ChatListItem[name="session:session-c"]')
  await expect(sessionC).toBeVisible()
}
