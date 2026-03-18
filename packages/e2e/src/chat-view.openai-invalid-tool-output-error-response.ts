import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-invalid-tool-output-error-response'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-1', [
    {
      id: 'message-1',
      role: 'user',
      text: 'what is the workspace uri?',
      time: '03:13 PM',
    },
    {
      id: '378c9e1e-8f0f-48d4-958d-d4f8b21efb00',
      inProgress: false,
      role: 'assistant',
      text: "OpenAI request failed (status 400): invalid_type [invalid_request_error]. Invalid type for 'input[0].output': expected one of a string or array of objects, but got an object instead.",
      time: '03:13 PM',
      toolCalls: [
        {
          arguments: '{}',
          errorMessage: 'Invalid tool output',
          id: 'call_mXNHmsE498dFuV51t41umW4S',
          name: 'getWorkspaceUri',
          status: 'error',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request failed (status 400): invalid_type [invalid_request_error].')
  await expect(messages.nth(1)).toContainText("Invalid type for 'input[0].output'")
  await expect(messages.nth(1)).toContainText('get_workspace_uri')
  await expect(messages.nth(1)).toContainText('(error: Invalid tool output)')
}
