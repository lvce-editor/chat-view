import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-pinning-disabled'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setSessionPinningEnabled', false)
  await Command.execute('Chat.openMockSession', 'Pin Disabled Chat', [])
  await Chat.handleClickBack()

  await Chat.handleChatListContextMenu(0, 70)

  const menuItems = Locator('.MenuItem')
  await expect(menuItems).toHaveCount(2)
  await expect(menuItems.nth(0)).toHaveText('Rename')
  await expect(menuItems.nth(1)).toHaveText('Archive')
}