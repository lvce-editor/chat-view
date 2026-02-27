import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-chat'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)

  const createSessionButton = Locator('.IconButton[name="create-session"]')
  await expect(createSessionButton).toBeVisible()
  await createSessionButton.click()

  const title = Locator('.ChatDetails .Label')
  await expect(title).toContainText('Chat 4')

  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
}