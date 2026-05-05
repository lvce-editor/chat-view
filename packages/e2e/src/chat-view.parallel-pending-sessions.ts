import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.parallel-pending-sessions'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const chatMessages = Locator('.ChatMessages .Message')
  const chatListLabels = Locator('.ChatListItemLabel')

  await Chat.openMockSession('Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
    { id: 'chat-1-assistant-pending', role: 'assistant', text: 'chat-1-pending', time: '10:01' },
  ])

  await Chat.openMockSession('Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
    { id: 'chat-2-assistant-pending', role: 'assistant', text: 'chat-2-pending', time: '10:03' },
  ])

  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')
  await expect(chatMessages.nth(1)).toContainText('chat-2-pending')

  await Chat.handleClickBack()
  await expect(chatListLabels).toHaveCount(2)
  await expect(chatListLabels.nth(0)).toHaveText('Chat 2')
  await expect(chatListLabels.nth(1)).toHaveText('Chat 1')

  await chatListLabels.nth(1).click()
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')
  await expect(chatMessages.nth(1)).toContainText('chat-1-pending')

  await Chat.openMockSession('Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
    { id: 'chat-1-assistant', role: 'assistant', text: 'chat-1-ai', time: '10:01' },
  ])
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')

  await Chat.handleClickBack()
  await expect(chatListLabels.nth(0)).toHaveText('Chat 2')
  await chatListLabels.nth(0).click()
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')
  await expect(chatMessages.nth(1)).toContainText('chat-2-pending')

  await Chat.openMockSession('Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
    { id: 'chat-2-assistant', role: 'assistant', text: 'chat-2-ai', time: '10:03' },
  ])
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
}
