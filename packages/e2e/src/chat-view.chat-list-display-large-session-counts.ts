import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-display-large-session-counts'

const counts = [10, 100, 1000, 10_000, 50_000]

const getTitle = (index: number): string => {
  return `Chat ${index + 1}`
}

const getRepresentativeIndices = (count: number): readonly number[] => {
  const middleIndex = Math.floor(count / 2) - 1
  return [0, middleIndex, count - 1]
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const chatList = Locator('.ChatList')
  const chatListItems = Locator('.ChatList .ChatListItem')
  const labels = Locator('.ChatListItemLabel')

  for (const count of counts) {
    await Command.execute('Chat.openMockSessions', count)
    await expect(chatList).toBeVisible()
    if (count <= 1000) {
      await expect(chatListItems).toHaveCount(count)
    }
    for (const index of getRepresentativeIndices(count)) {
      await expect(labels.nth(index)).toHaveText(getTitle(index))
    }
  }
}
