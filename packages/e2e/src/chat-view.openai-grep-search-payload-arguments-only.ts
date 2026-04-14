import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-grep-search-payload-arguments-only'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  const nestedArguments =
    '{"includeIgnoredFiles":false,"includePattern":"**/*","isRegexp":true,"maxResults":100,"query":"memoryMeasurement|MemoryMeasurement","useDefaultExcludes":true}'

  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-grep-search-payload-arguments-only', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'search memory measurement usages',
      time: '03:13 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'I searched for memory measurement usage and found matching files.',
      time: '03:13 PM',
      toolCalls: [
        {
          arguments: JSON.stringify({
            arguments: JSON.parse(nestedArguments),
            name: 'grep_search',
            result: {
              count: 50,
              matches: [
                {
                  line: 28,
                  path: 'node_modules/@lerna/create/node_modules/nx/plugins/package-json.js',
                },
              ],
            },
          }),
          id: 'call_01',
          name: 'grep_search',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)

  const toolCall = messages.nth(1).locator('.ChatOrderedListItem').nth(0)
  await expect(toolCall).toContainText('grep_search')
  await expect(toolCall).toContainText('"memoryMeasurement|MemoryMeasurement"')
  await expect(toolCall).toHaveAttribute('title', nestedArguments)
}
