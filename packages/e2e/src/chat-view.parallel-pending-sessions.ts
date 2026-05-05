import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.parallel-pending-sessions'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const chatMessages = Locator('.ChatMessages .Message')

  await Command.execute('Chat.openMockSession', 'Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
  ])

  await Command.execute('Chat.openMockSession', 'Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
  ])

  await Command.execute('Chat.openMockSession', 'Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
  ])
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')
  await Command.execute('Chat.openMockSession', 'Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
    { id: 'chat-1-assistant', role: 'assistant', text: 'chat-1-ai', time: '10:01' },
  ])
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')

  await Command.execute('Chat.openMockSession', 'Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
  ])
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')
  await Command.execute('Chat.openMockSession', 'Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
    { id: 'chat-2-assistant', role: 'assistant', text: 'chat-2-ai', time: '10:03' },
  ])
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
}
