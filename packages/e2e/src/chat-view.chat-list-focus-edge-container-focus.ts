import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-focus-edge-container-focus'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleClickNew()
  await Chat.handleClickBack()

  await Command.execute('Chat.handleInputFocus', 'chat-list')

  const focusedItem = Locator('.ChatList .ChatListItemFocused')
  await expect(focusedItem).toHaveCount(0)

  await Command.execute('Chat.chatListFocusNext')
  await expect(focusedItem).toHaveCount(1)
}
