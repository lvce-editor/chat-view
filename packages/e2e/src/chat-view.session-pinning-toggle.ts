import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.session-pinning-toggle'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'Chat A', [])
  await Command.execute('Chat.openMockSession', 'Chat B', [])
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const chatListLabels = Locator('.ChatListItemLabel')
  const pinButtons = Locator('.SessionPinButton')

  await expect(chatListItems).toHaveCount(2)
  await expect(pinButtons).toHaveCount(2)
  await expect(chatListLabels.nth(0)).toHaveText('Chat A')
  await expect(chatListLabels.nth(1)).toHaveText('Chat B')
  await expect(chatListItems.nth(0)).toHaveAttribute('data-pinned', 'false')
  await expect(chatListItems.nth(1)).toHaveAttribute('data-pinned', 'false')

  await pinButtons.nth(1).click()

  await expect(chatListLabels.nth(0)).toHaveText('Chat B')
  await expect(chatListLabels.nth(1)).toHaveText('Chat A')
  await expect(chatListItems.nth(0)).toHaveAttribute('data-pinned', 'true')
  await expect(chatListItems.nth(1)).toHaveAttribute('data-pinned', 'false')

  await pinButtons.nth(0).click()

  await expect(chatListLabels.nth(0)).toHaveText('Chat A')
  await expect(chatListLabels.nth(1)).toHaveText('Chat B')
  await expect(chatListItems.nth(0)).toHaveAttribute('data-pinned', 'false')
  await expect(chatListItems.nth(1)).toHaveAttribute('data-pinned', 'false')
}
