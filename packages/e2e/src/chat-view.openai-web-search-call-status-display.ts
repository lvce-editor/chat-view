import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-status-display'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-status-display', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search the web for release notes',
      time: '11:00 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'Showing the current web search state.',
      time: '11:01 AM',
      toolCalls: [
        {
          arguments: '',
          id: 'web-search-1',
          name: 'web_search_call',
          status: 'in-progress',
        },
        {
          arguments: '',
          id: 'web-search-2',
          name: 'web_search_call',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(2)
  await expect(toolCalls.nth(0)).toHaveText('1.web_search (in progress)')
  await expect(toolCalls.nth(1)).toHaveText('2.web_search (finished)')
  await expect(messages.nth(2)).toHaveText('Showing the current web search state.')
}
