import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.switch-chat-existing-messages'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'Chat A', [
    {
      id: 'message-a-1',
      role: 'user',
      text: 'chat-a-user',
      time: '10:00',
    },
    {
      id: 'message-a-2',
      role: 'assistant',
      text: 'chat-a-assistant',
      time: '10:01',
    },
  ])
  await Command.execute('Chat.openMockSession', 'Chat B', [
    {
      id: 'message-b-1',
      role: 'user',
      text: 'chat-b-user',
      time: '10:02',
    },
    {
      id: 'message-b-2',
      role: 'assistant',
      text: 'chat-b-assistant',
      time: '10:03',
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const chatListLabels = Locator('.ChatListItemLabel')

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toContainText('chat-b-user')
  await expect(messages.nth(1)).toContainText('chat-b-assistant')

  await Chat.handleClickBack()
  await expect(chatListLabels).toHaveCount(2)
  await expect(chatListLabels.nth(0)).toHaveText('Chat B')
  await expect(chatListLabels.nth(1)).toHaveText('Chat A')

  await Command.execute('Chat.handleClick', 'session:Chat A')

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toContainText('chat-a-user')
  await expect(messages.nth(1)).toContainText('chat-a-assistant')

  await Chat.handleClickBack()

  await expect(chatListLabels.nth(0)).toHaveText('Chat B')
  await Command.execute('Chat.handleClick', 'session:Chat B')

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toContainText('chat-b-user')
  await expect(messages.nth(1)).toContainText('chat-b-assistant')
}
