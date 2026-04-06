import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-focus-edge-container-focus'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleClickNew()
  await Chat.handleInput('first session message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  await Chat.handleInputFocus()

  const focusedItem = Locator('.ChatList .ChatListItemFocused')
  await expect(focusedItem).toHaveCount(0)

  await Command.execute('Chat.chatListFocusNext')
  await expect(focusedItem).toHaveCount(1)
}
