import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-archive-button'

export const test: Test = async ({ Chat, Command, expect, KeyBoard, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'Archive target', [])
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const archiveButton = Locator('.SessionArchiveButton')
  await expect(chatListItems).toHaveCount(1)
  await Chat.chatListFocusFirst()
  await KeyBoard.press('Tab')
  await expect(archiveButton).toBeFocused()
  await KeyBoard.press('Enter')

  await expect(chatListItems).toHaveCount(0)
}
