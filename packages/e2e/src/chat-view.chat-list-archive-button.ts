import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-archive-button'

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'Archive target', [])
  await Chat.handleClickBack()

  const chatListItems = Locator('.ChatList .ChatListItem')
  const archiveIcon = Locator('.SessionArchiveButton .MaskIconArchive')
  await expect(chatListItems).toHaveCount(1)
  await archiveIcon.dispatchEvent('click', clickEventInit)

  await expect(chatListItems).toHaveCount(0)
}
