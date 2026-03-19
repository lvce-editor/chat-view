import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.search-100-items-found'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setSearchEnabled', true)

  const mockMessages = Array.from({ length: 100 }, (_, index) => ({
    id: `m-${index + 1}`,
    role: 'user',
    text: `Seed message ${index + 1}`,
    time: '10:00',
  }))

  for (let i = 0; i < 100; i++) {
    await Command.execute('Chat.openMockSession', `searchable-${i + 1}`, mockMessages)
  }

  await Command.execute('Chat.handleClickBack')

  const searchButton = Locator('.ChatHeader .IconButton[name="toggle-search"]')
  await searchButton.click()

  const searchInput = Locator('.ChatHeader .InputBox[name="search"]')
  await expect(searchInput).toBeVisible()
  await searchInput.type('searchable-')

  const list = Locator('.ChatList .ChatListItem')
  await expect(list).toHaveCount(100)
}
