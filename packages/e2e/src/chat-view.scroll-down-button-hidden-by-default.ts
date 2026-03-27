import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.scroll-down-button-hidden-by-default'

const getMockMessages = (): readonly { readonly id: string; readonly role: 'user' | 'assistant'; readonly text: string; readonly time: string }[] => {
  return Array.from({ length: 80 }, (_, index) => ({
    id: `message-${index}`,
    role: index % 2 === 0 ? 'user' : 'assistant',
    text: `message ${index}`,
    time: `10:${String(index).padStart(2, '0')}`,
  }))
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'scroll-down-default-hidden', getMockMessages())
  await Command.execute('Chat.handleMessagesScroll', 0, 4000, 400)
  await Chat.rerender()

  const scrollDownButton = Locator('.Button[name="scroll-down"]')
  await expect(scrollDownButton).toHaveCount(0)
}
