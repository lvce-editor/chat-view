import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-time-setting'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'Chat A', [{ id: 'message-1', role: 'assistant', text: 'Done', time: '10:30' }])
  await Command.execute('Chat.openMockSession', 'Chat B', [])
  await Chat.handleClickBack()

  const sessionTimes = Locator('.ChatListItemTime')
  await expect(sessionTimes).toHaveCount(2)
  await expect(sessionTimes.nth(0)).toHaveText('10:30')
  await expect(sessionTimes.nth(1)).toHaveText('n/a')

  await Command.execute('Chat.setShowChatListTime', false)

  await expect(sessionTimes).toHaveCount(0)
}
