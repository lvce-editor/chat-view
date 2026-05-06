import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.search-no-items-found'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.openMockSession('Dummy Chat A', [])
  await Chat.openMockSession('Dummy Chat B', [])
  await Chat.openMockSession('Dummy Chat C', [])
  await Chat.handleClickBack()
  await Chat.setSearchEnabled(true)

  const searchButton = Locator('.ChatHeader .IconButton[name="toggle-search"]')
  await expect(searchButton).toBeVisible()
  await Command.execute('Chat.handleClick', 'toggle-search')

  const searchInput = Locator('.ChatHeader .InputBox[name="search"]')
  await expect(searchInput).toBeVisible()
  await searchInput.type('not-found-query')

  const list = Locator('.ChatList .ChatListItem')
  const empty = Locator('.ChatListEmpty')
  await expect(list).toHaveCount(0)
  await expect(empty).toBeVisible()
}
