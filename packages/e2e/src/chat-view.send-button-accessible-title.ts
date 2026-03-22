import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-button-accessible-title'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const sendButton = Locator('.IconButton[name="send"]')
  const sendIcon = Locator('.IconButton[name="send"] .MaskIconArrowUp')
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('title', 'Send message')
  await expect(sendIcon).toHaveAttribute('role', 'none')
}
