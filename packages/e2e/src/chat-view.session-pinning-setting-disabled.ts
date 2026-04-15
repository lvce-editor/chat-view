import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.session-pinning-setting-disabled'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setSessionPinningEnabled', false)
  await Command.execute('Chat.openMockSession', 'Chat A', [])
  await Chat.handleClickBack()

  const chatListItem = Locator('.ChatList .ChatListItem')
  const pinButtons = Locator('.SessionPinButton')

  await expect(chatListItem).toHaveCount(1)
  await expect(chatListItem).toHaveAttribute('data-pinned', 'false')
  await expect(pinButtons).toHaveCount(0)
}
