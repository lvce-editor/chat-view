import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-web-search-call-completed-empty-arguments'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-web-search-call-completed-empty-arguments', [
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
          arguments: '',
          id: 'web-search-1',
          name: 'web_search_call',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(1)
  await expect(toolCalls.nth(0)).toHaveText('1.web_search (finished)')
  await expect(messages.nth(2)).toHaveText('The search finished.')
}