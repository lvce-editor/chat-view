import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-rename-file-e2e'

export const skip = 1

export const test: Test = async ({ Chat, FileSystem, Locator, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  // create original.txt with initial content
  await FileSystem.writeFile(`${tmpDir}/original.txt`, 'hello world')
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const sseResponseParts = [
    {
      eventId: 1,
      sessionId: '01',
      timestamp: new Date().toISOString(),
      type: 'sse-response-completed',
      value: {
        response: {
          background: false,
          completed_at: 1,
          created_at: 1,
          error: null,
          id: 'resp_01',
          model: 'gpt-4.1-mini-2025-04-14',
          object: 'response',
          output: [
            {
              arguments: JSON.stringify({ path: 'original.txt', newPath: 'renamed.txt' }),
              call_id: 'call_01',
              id: 'fc_01',
              name: 'rename_file',
              status: 'completed',
              type: 'function_call',
            },
          ],
          status: 'completed',
          tool_choice: 'auto',
          tools: [],
        },
        sequence_number: 1,
        type: 'response.completed',
      },
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('Please rename original.txt to renamed.txt')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('Please rename original.txt to renamed.txt')
  await expect(messages.nth(1)).toContainText('rename_file')
  await expect(messages.nth(1)).toContainText('renamed.txt')

  // allow a short moment for the tool execution to complete
  await new Promise((resolve) => setTimeout(resolve, 200))

  // verify the original file still exists (since actual tool execution isn't implemented yet)
  const originalContent = await FileSystem.readFile(`${tmpDir}/original.txt`)
  if (originalContent !== 'hello world') {
    throw new Error(`Expected original.txt to still contain "hello world", got "${originalContent}"`)
  }
}
