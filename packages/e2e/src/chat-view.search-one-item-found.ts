import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.search-one-item-found'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.openMockSession('Dummy Chat A', [])
  await Chat.openMockSession('Dummy Chat B', [])
  await Chat.openMockSession('Dummy Chat C', [])
  await Chat.handleClickBack()
  await Chat.setSearchEnabled(true)

  const searchButton = Locator('.ChatHeader .IconButton[name="toggle-search"]')
  await searchButton.click()

  const searchInput = Locator('.ChatHeader .InputBox[name="search"]')
  await expect(searchInput).toBeVisible()
  await searchInput.type('Dummy Chat B')

  const list = Locator('.ChatList .ChatListItem')
  await expect(list).toHaveCount(1)

  const labels = Locator('.ChatListItemLabel')
  await expect(labels).toHaveText('Dummy Chat B')
}
