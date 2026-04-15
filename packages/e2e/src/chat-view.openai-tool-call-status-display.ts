import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-tool-call-status-display'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-tool-call-status-display', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'show me the tool status states',
      time: '09:10 AM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'Here are the current tool states.',
      time: '09:11 AM',
      toolCalls: [
        {
          arguments: JSON.stringify({ path: 'src/app.ts' }),
          id: 'call_01',
          name: 'read_file',
          status: 'success',
        },
        {
          arguments: JSON.stringify({ uri: 'file:///workspace' }),
          id: 'call_02',
          name: 'list_files',
          status: 'in-progress',
        },
        {
          arguments: JSON.stringify({ oldUri: 'file:///workspace/src/old.ts', newUri: 'file:///workspace/src/new.ts' }),
          id: 'call_03',
          name: 'rename',
          status: 'canceled',
        },
        {
          arguments: JSON.stringify({ path: 'src/missing.ts' }),
          errorMessage: 'File not found: src/missing.ts',
          id: 'call_04',
          name: 'read_file',
          status: 'error',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(1)).toContainText('read_file app.ts (finished)')
  await expect(messages.nth(1)).toContainText('list_files workspace (in progress)')
  await expect(messages.nth(1)).toContainText('rename old.ts -> new.ts (canceled)')
  await expect(messages.nth(1)).toContainText('read_file missing.ts (error: File not found: src/missing.ts)')
  await expect(messages.nth(2)).toContainText('Here are the current tool states.')
}
