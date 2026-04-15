import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-tool-call-status-mixed'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-tool-call-status-mixed', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'show a mixed tool run',
      time: '02:30 PM',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'This run has finished, running, and errored tools at once.',
      time: '02:31 PM',
      toolCalls: [
        {
          arguments: '{}',
          id: 'call_01',
          name: 'getWorkspaceUri',
          result: 'file:///workspace',
          status: 'success',
        },
        {
          arguments: JSON.stringify({ uri: 'file:///workspace' }),
          id: 'call_02',
          name: 'list_files',
          status: 'in-progress',
        },
        {
          arguments: JSON.stringify({ path: 'src/server.ts' }),
          errorMessage: 'permission denied',
          id: 'call_03',
          name: 'read_file',
          status: 'error',
        },
        {
          arguments: JSON.stringify({ oldUri: 'file:///workspace/src/old.ts', newUri: 'file:///workspace/src/new.ts' }),
          id: 'call_04',
          name: 'rename',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')

  await expect(messages).toHaveCount(3)
  await expect(toolCalls).toHaveCount(4)
  await expect(messages.nth(1)).toContainText('get_workspace_uri workspace (finished)')
  await expect(messages.nth(1)).toContainText('list_files workspace (in progress)')
  await expect(messages.nth(1)).toContainText('read_file server.ts (error: permission denied)')
  await expect(messages.nth(1)).toContainText('rename old.ts -> new.ts (finished)')
  await expect(messages.nth(2)).toContainText('This run has finished, running, and errored tools at once.')
}