import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.parallel-pending-sessions'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const chatListLabels = Locator('.ChatListItemLabel')
  const chat1User = Locator('text=chat-1-user')
  const chat1Pending = Locator('text=chat-1-pending')
  const chat1Ai = Locator('text=chat-1-ai')
  const chat2User = Locator('text=chat-2-user')
  const chat2Pending = Locator('text=chat-2-pending')
  const chat2Ai = Locator('text=chat-2-ai')

  await Chat.openMockSession('Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
    { id: 'chat-1-assistant-pending', role: 'assistant', text: 'chat-1-pending', time: '10:01' },
  ])
  await Chat.rerender()

  await Chat.openMockSession('Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
    { id: 'chat-2-assistant-pending', role: 'assistant', text: 'chat-2-pending', time: '10:03' },
  ])
  await Chat.rerender()

  await expect(chat2User).toBeVisible()
  await expect(chat2Pending).toBeVisible()

  await Chat.handleClickBack()
  await expect(chatListLabels).toHaveCount(2)
  const chatListLabel0 = chatListLabels.nth(0)
  const chatListLabel1 = chatListLabels.nth(1)
  await expect(chatListLabel0).toHaveText('Chat 2')
  await expect(chatListLabel1).toHaveText('Chat 1')

  await Command.execute('Chat.handleClick', 'session:Chat 1')
  await expect(chat1User).toBeVisible()
  await expect(chat1Pending).toBeVisible()

  await Chat.openMockSession('Chat 1', [
    { id: 'chat-1-user', role: 'user', text: 'chat-1-user', time: '10:00' },
    { id: 'chat-1-assistant', role: 'assistant', text: 'chat-1-ai', time: '10:01' },
  ])
  await Chat.rerender()
  await expect(chat1Ai).toBeVisible()

  await Chat.handleClickBack()
  await expect(chatListLabel0).toHaveText('Chat 2')
  await Command.execute('Chat.handleClick', 'session:Chat 2')
  await expect(chat2User).toBeVisible()
  await expect(chat2Pending).toBeVisible()

  await Chat.openMockSession('Chat 2', [
    { id: 'chat-2-user', role: 'user', text: 'chat-2-user', time: '10:02' },
    { id: 'chat-2-assistant', role: 'assistant', text: 'chat-2-ai', time: '10:03' },
  ])
  await Chat.rerender()
  await expect(chat2Ai).toBeVisible()
}
