import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-more-expand-collapse'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat 1', [])
  await Command.execute('Chat.openMockSession', 'Chat 2', [])
  await Command.execute('Chat.openMockSession', 'Chat 3', [])
  await Chat.handleClickBack()

  const sessionRows = Locator('.ChatList .ChatListItemLabel[name^="session:"]')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  await expect(sessionRows).toHaveCount(3)
  await expect(moreToggle).toHaveCount(0)

  await Command.execute('Chat.openMockSession', 'Chat 4', [])
  await Command.execute('Chat.openMockSession', 'Chat 5', [])
  await Chat.handleClickBack()

  await expect(sessionRows).toHaveCount(3)
  await expect(moreToggle).toHaveCount(1)

  await moreToggle.click()
  await expect(sessionRows).toHaveCount(5)

  await moreToggle.click()
  await expect(sessionRows).toHaveCount(3)
}
