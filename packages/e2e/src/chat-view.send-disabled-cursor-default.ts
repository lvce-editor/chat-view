import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-cursor-default'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  const sendButton = Locator('.IconButton[name="send"]')
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('disabled', '')
  await expect(sendButton).toHaveCSS('cursor', 'default')
}
