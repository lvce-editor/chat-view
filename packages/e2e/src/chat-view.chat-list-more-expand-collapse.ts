import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-more-expand-collapse'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('Chat 1', [])
  await Chat.openMockSession('Chat 2', [])
  await Chat.openMockSession('Chat 3', [])
  await Chat.handleClickBack()

  const sessionTitles = Locator('.ChatList .ChatListItemTitle')
  const moreToggle = Locator('.ChatList .ChatListItemLabel[name="chat-list-show-more"]')

  await expect(sessionTitles).toHaveCount(3)
  const sessionTitle0 = sessionTitles.nth(0)
  await expect(sessionTitle0).toHaveText('Chat 1')
  const sessionTitle1 = sessionTitles.nth(1)
  await expect(sessionTitle1).toHaveText('Chat 2')
  const sessionTitle2 = sessionTitles.nth(2)
  await expect(sessionTitle2).toHaveText('Chat 3')
  await expect(moreToggle).toHaveCount(0)

  await Chat.openMockSession('Chat 4', [])
  await Chat.openMockSession('Chat 5', [])
  await Chat.handleClickBack()

  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveCount(1)
  await expect(moreToggle).toHaveText('Show 2 More')

  await Command.execute('Chat.handleClick', 'chat-list-show-more')
  await expect(sessionTitles).toHaveCount(5)
  const sessionTitle3 = sessionTitles.nth(3)
  await expect(sessionTitle3).toHaveText('Chat 4')
  const sessionTitle4 = sessionTitles.nth(4)
  await expect(sessionTitle4).toHaveText('Chat 5')
  await expect(moreToggle).toHaveText('Show Less')

  await Command.execute('Chat.handleClick', 'chat-list-show-more')
  await expect(sessionTitles).toHaveCount(3)
  await expect(moreToggle).toHaveText('Show 2 More')
}
