import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.search-no-items-found'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)
  await Command.execute('Chat.setSearchEnabled', true)

  const searchButton = Locator('.ChatHeader .IconButton[name="toggle-search"]')
  await searchButton.click()

  const searchInput = Locator('.ChatHeader .InputBox[name="search"]')
  await expect(searchInput).toBeVisible()
  await searchInput.type('not-found-query')

  const list = Locator('.ChatList .ChatListItem')
  const empty = Locator('.ChatListEmpty')
  await expect(list).toHaveCount(0)
  await expect(empty).toBeVisible()
}
