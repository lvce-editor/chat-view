import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-grep-search-result-only-preview'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-grep-search-result-only-preview', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'find hello',
      time: '03:13 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'I found a match.',
      time: '03:13 PM',
      toolCalls: [
        {
          arguments: '{"includeIgnoredFiles":false,"includePattern":"**","isRegexp":false,"maxResults":10,"query":"hello"}',
          id: 'call_01',
          name: 'grep_search',
          result: JSON.stringify({
            arguments: {
              includeIgnoredFiles: false,
              includePattern: '**',
              isRegexp: false,
              maxResults: 10,
              query: 'hello',
            },
            name: 'grep_search',
            result: [
              {
                line: 3,
                path: 'src/example.ts',
                text: 'const hello = true',
              },
            ],
          }),
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)

  const toolCallMessage = messages.nth(1)
  await expect(toolCallMessage.locator('.ChatOrderedListItem')).toHaveCount(1)
  await expect(toolCallMessage).toContainText('src/example.ts')
  await expect(toolCallMessage).not.toContainText('grep_search')
  await expect(toolCallMessage).not.toContainText('"query":"hello"')
}
