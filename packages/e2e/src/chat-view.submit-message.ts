import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.submit-message'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)

  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await composer.type('hello from e2e')

  const sendButton = Locator('.Button[name="send"]')
  await sendButton.click()

  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(1)
  await expect(messages.first()).toContainText('hello from e2e')
}
