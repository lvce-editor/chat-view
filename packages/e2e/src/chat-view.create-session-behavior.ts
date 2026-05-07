import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.create-session-behavior'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.openMockSession('Dummy Chat A', [])
  await Chat.openMockSession('Dummy Chat B', [])
  await Chat.openMockSession('Dummy Chat C', [])
  await Chat.handleClickBack()

  const composer = Locator('.ChatInputBox[name="composer"]')
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const chatListItems = Locator('.ChatList .ChatListItem')

  await expect(composer).toBeVisible()
  await expect(backButton).toBeVisible()
  await expect(chatListItems).toHaveCount(3)

  await composer.type('draft before creating a new chat')
  await expect(composer).toHaveValue('draft before creating a new chat')

  await Command.execute('Chat.handleClick', 'create-session')

  await expect(chatListItems).toHaveCount(3)
  await expect(backButton).toHaveCount(0)
  await expect(composer).toHaveValue('')
  await expect(composer).toBeFocused()

  await composer.type('hello from first message')
  await Command.execute('Chat.handleClick', 'send')

  await expect(chatListItems).toHaveCount(4)
}
