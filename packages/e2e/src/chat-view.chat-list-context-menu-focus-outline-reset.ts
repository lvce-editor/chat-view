import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-context-menu-focus-outline-reset'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('context menu target message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  const outlinedItem = Locator('.ChatList .ChatListItem.ChatListItemFocusOutline')

  await Chat.handleChatListContextMenu(0, 70)
  await expect(outlinedItem).toHaveCount(1)

  await Command.execute('Chat.handleInputFocus', 'chat-list')

  await expect(outlinedItem).toHaveCount(0)
}
