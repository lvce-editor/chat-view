import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-rename-file-enoent-error'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-rename-file-enoent', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'please rename nonexistent.txt to something-else.txt',
      time: '08:12 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'I could not rename that file.',
      time: '08:12 PM',
      toolCalls: [
        {
          arguments: JSON.stringify({
            newPath: 'something-else.txt',
            path: 'nonexistent.txt',
          }),
          errorMessage: 'File not found: nonexistent.txt',
          id: 'call_01',
          name: 'rename_file',
          status: 'not-found',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText('please rename nonexistent.txt to something-else.txt')
  const message1 = messages.nth(1)
  await expect(message1).toContainText('I could not rename that file.')
  await expect(message1).toContainText('rename_file')
  await expect(message1).toContainText('(error: File not found: nonexistent.txt)')
  const message1OrderedListItem = message1.locator('.ChatOrderedListItem')
  await expect(message1OrderedListItem).toHaveAttribute('title', 'nonexistent.txt')
}
