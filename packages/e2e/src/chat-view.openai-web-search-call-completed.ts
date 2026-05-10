import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-completed'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-completed', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search the web for release notes',
      time: '11:10 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'The search finished.',
      time: '11:11 AM',
      toolCalls: [
        {
          arguments: '{"query":"release notes"}',
          id: 'web-search-1',
          name: 'web_search_call',
          status: 'success',
        },
      ],
    },
  ])

  await Command.execute('Chat.appendChatViewEvents', [
    {
      sessionId: 'session-web-search-call-completed',
      timestamp: '2026-04-19T00:00:00.000Z',
      title: 'session-web-search-call-completed',
      type: 'chat-session-created',
    },
    {
      messages: [
        {
          id: 'message-user-1',
          role: 'user',
          text: 'search the web for release notes',
          time: '11:10 AM',
        },
        {
          id: 'message-assistant-1',
          role: 'assistant',
          text: 'The search finished.',
          time: '11:11 AM',
          toolCalls: [
            {
              arguments: '{"query":"release notes"}',
              id: 'web-search-1',
              name: 'web_search_call',
              status: 'success',
            },
          ],
        },
      ],
      sessionId: 'session-web-search-call-completed',
      timestamp: '2026-04-19T00:00:01.000Z',
      type: 'chat-session-messages-replaced',
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(1)
  await expect(toolCalls.nth(0)).toHaveText('1.web_search "release notes" (finished)')
  await expect(messages.nth(2)).toHaveText('The search finished.')
}
