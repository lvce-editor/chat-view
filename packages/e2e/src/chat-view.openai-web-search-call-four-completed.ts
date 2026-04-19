import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-four-completed'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-four-completed', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search the web for four topics',
      time: '11:30 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'All web searches finished.',
      time: '11:31 AM',
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
          status: 'success',
        },
        {
          arguments: '',
          id: 'web-search-4',
          name: 'web_search_call',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(4)
  await expect(toolCalls.nth(0)).toContainText('web_search (finished)')
  await expect(toolCalls.nth(1)).toContainText('web_search (finished)')
  await expect(toolCalls.nth(2)).toContainText('web_search (finished)')
  await expect(toolCalls.nth(3)).toContainText('web_search (finished)')
  await expect(messages.nth(2)).toContainText('All web searches finished.')
}
