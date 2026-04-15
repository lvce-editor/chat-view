import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.switch-chat-scrolls-to-bottom'

const getMockMessages = (
  prefix: string,
): readonly { readonly id: string; readonly role: 'user' | 'assistant'; readonly text: string; readonly time: string }[] => {
  return Array.from({ length: 80 }, (_, index) => ({
    id: `${prefix}-message-${index}`,
    role: index % 2 === 0 ? 'user' : 'assistant',
    text: `${prefix} message ${index}`,
    time: `11:${String(index).padStart(2, '0')}`,
  }))
}

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('Chat A', getMockMessages('chat-a'))
  await Chat.openMockSession('Chat B', getMockMessages('chat-b'))

  const chatMessages = Locator('.ChatMessages')
  const messages = Locator('.ChatMessages .Message')

  await expect(messages).toHaveCount(80)
  await Chat.handleMessagesScroll(0, 4000, 400)
  await Chat.rerender()
  await expect(chatMessages).toHaveJSProperty('scrollTop', 0)

  await Chat.openMockSession('Chat A', getMockMessages('chat-a'))

  await expect(messages).toHaveCount(80)
  await expect(messages.nth(79)).toContainText('chat-a message 79')
  await expect(chatMessages).not.toHaveJSProperty('scrollTop', 0)
}
