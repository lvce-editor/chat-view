import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-more-expand-collapse'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [])
  await Command.execute('Chat.openMockSession', 'Chat 2', [])
  await Command.execute('Chat.openMockSession', 'Chat 3', [])
  await Chat.handleClickBack()

  const sessionTitles = Locator('.ChatList .ChatListItemTitle')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  await expect(sessionTitles).toHaveCount(3)
  await expect(sessionTitles.nth(0)).toHaveText('Chat 1')
  await expect(sessionTitles.nth(1)).toHaveText('Chat 2')
  await expect(sessionTitles.nth(2)).toHaveText('Chat 3')
  await expect(moreToggle).toHaveCount(0)

  await Command.execute('Chat.openMockSession', 'Chat 4', [])
  await Command.execute('Chat.openMockSession', 'Chat 5', [])
  await Chat.handleClickBack()

  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveCount(1)
  await expect(moreToggle).toHaveText('Show 2 More')

  await moreToggle.click()
  await expect(sessionTitles).toHaveCount(5)
  await expect(sessionTitles.nth(3)).toHaveText('Chat 4')
  await expect(sessionTitles.nth(4)).toHaveText('Chat 5')
  await expect(moreToggle).toHaveText('Show Less')

  await moreToggle.click()
  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveText('Show 2 More')
}
