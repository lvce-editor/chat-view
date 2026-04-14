import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-time-10-hours'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  const now = Date.parse('2026-04-14T12:00:00.000Z')

  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setNowForTest', now)
  await Command.execute('Chat.openMockSession', '10 hours', [], {
    lastActiveTime: new Date(now - 10 * 60 * 60_000).toISOString(),
  })
  await Chat.handleClickBack()

  const sessionTime = Locator('.ChatListItemTime')
  await expect(sessionTime).toHaveCount(1)
  await expect(sessionTime).toHaveText('10 hrs ago')
}
