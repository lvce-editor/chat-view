import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-two-completed-one-in-progress'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-two-completed-one-in-progress', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search the web with several queries',
      time: '11:20 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'Some searches are finished and one is still running.',
      time: '11:21 AM',
      toolCalls: [
        {
          arguments: '',
          id: 'web-search-1',
          name: 'web_search_call',
          status: 'success',
        },
        {
          arguments: '',
          id: 'web-search-2',
          name: 'web_search_call',
          status: 'success',
        },
        {
          arguments: '',
          id: 'web-search-3',
          name: 'web_search_call',
          status: 'in-progress',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(3)
  await expect(toolCalls.nth(0)).toHaveText('1.web_search (finished)')
  await expect(toolCalls.nth(1)).toHaveText('2.web_search (finished)')
  await expect(toolCalls.nth(2)).toHaveText('3.web_search (in progress)')
  await expect(messages.nth(2)).toHaveText('Some searches are finished and one is still running.')
}
