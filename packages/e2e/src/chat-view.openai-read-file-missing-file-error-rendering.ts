import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-read-file-missing-file-error-rendering'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  const missingPath = 'src/does-not-exist.txt'
  const errorMessage = `File not found: ${missingPath}`

  await Chat.openMockSession('session-read-file-missing', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'please read src/does-not-exist.txt',
      time: '08:12 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'I could not read that file.',
      time: '08:12 PM',
      toolCalls: [
        {
          arguments: JSON.stringify({
            path: missingPath,
          }),
          errorMessage,
          id: 'call_01',
          name: 'read_file',
          status: 'not-found',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('please read src/does-not-exist.txt')
  await expect(messages.nth(1)).toContainText('I could not read that file.')
  await expect(messages.nth(1)).toContainText('read_file does-not-exist.txt')
  await expect(messages.nth(1)).toContainText(`(error: ${errorMessage})`)
  await expect(messages.nth(1).locator('.ChatOrderedListItem')).toHaveAttribute('title', missingPath)
}
