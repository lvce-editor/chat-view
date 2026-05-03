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

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const chatList = Locator('.ChatList')
  const sessionTitles = Locator('.ChatList .ChatListItemTitle')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  for (const count of counts) {
    await Command.execute('Chat.openMockSessions', count)
    await expect(chatList).toBeVisible()
    if (count <= 1000) {
      await expect(sessionTitles).toHaveCount(Math.min(count, 3))
      await expect(moreToggle).toHaveCount(count > 3 ? 1 : 0)
    }
    await expect(sessionTitles.nth(0)).toHaveText(getTitle(0))

    if (count > 3) {
      await moreToggle.click()
      await expect(sessionTitles).toHaveCount(count)
      await expect(sessionTitles.nth(Math.floor(count / 2) - 1)).toHaveText(getTitle(Math.floor(count / 2) - 1))
      await expect(sessionTitles.nth(count - 1)).toHaveText(getTitle(count - 1))
      await moreToggle.click()
      await expect(sessionTitles).toHaveCount(3)
    }
  }
}
