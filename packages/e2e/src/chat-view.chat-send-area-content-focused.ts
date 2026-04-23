import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-send-area-content-focused'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const focusedSendAreaContent = Locator('.ChatSendAreaContentFocused')

  await expect(focusedSendAreaContent).toHaveCount(0)

  await Command.execute('Chat.handleInputFocus', 'composer')

  await expect(focusedSendAreaContent).toHaveCount(1)
}
