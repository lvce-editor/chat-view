import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-in-progress'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-in-progress', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search the web for changelog updates',
      time: '11:00 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'Searching the web.',
      time: '11:01 AM',
      toolCalls: [
        {
          arguments: '',
          id: 'web-search-1',
          name: 'web_search_call',
          status: 'in-progress',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(1)
  await expect(toolCalls.nth(0)).toHaveText('web_search (in progress)')
  await expect(messages.nth(2)).toContainText('Searching the web.')
}