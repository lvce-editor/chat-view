import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-pin-toggle'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'Context Menu Chat', [])
  await Chat.handleClickBack()

  const chatListItem = Locator('.ChatList .ChatListItem').nth(0)

  await expect(chatListItem).toHaveAttribute('data-pinned', 'false')

  await Chat.handleChatListContextMenu(0, 70)
  const pinMenuItem = Locator('.MenuItem').nth(1)
  await expect(pinMenuItem).toHaveText('Pin')
  await pinMenuItem.click()

  await expect(chatListItem).toHaveAttribute('data-pinned', 'true')

  await Chat.handleChatListContextMenu(0, 70)
  const unpinMenuItem = Locator('.MenuItem').nth(1)
  await expect(unpinMenuItem).toHaveText('Unpin')
  await unpinMenuItem.click()

  await expect(chatListItem).toHaveAttribute('data-pinned', 'false')
}