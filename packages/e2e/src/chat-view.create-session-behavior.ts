import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.create-session-behavior'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.openMockSession', 'Dummy Chat A', [])
  await Command.execute('Chat.openMockSession', 'Dummy Chat B', [])
  await Command.execute('Chat.openMockSession', 'Dummy Chat C', [])
  await Command.execute('Chat.handleClickBack')

  const composer = Locator('.ChatInputBox[name="composer"]')
  const createSessionButton = Locator('.IconButton[name="create-session"]')
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const chatListItems = Locator('.ChatList .ChatListItem')

  await expect(composer).toBeVisible()
  await expect(backButton).toBeVisible()
  await expect(chatListItems).toHaveCount(3)

  await composer.type('draft before creating a new chat')
  await expect(composer).toHaveValue('draft before creating a new chat')

  await createSessionButton.click()

  await expect(chatListItems).toHaveCount(3)
  await expect(backButton).toHaveCount(0)
  await expect(composer).toHaveValue('')
  await expect(composer).toBeFocused()

  await composer.type('hello from first message')
  const sendButton = Locator('.Button[name="send"]')
  await sendButton.click()

  await expect(chatListItems).toHaveCount(4)
}
