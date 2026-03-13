import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-update-file-e2e'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const fs = await import('fs/promises')

  const tmpDir = await FileSystem.getTmpDir()
  // create index.html with initial content
  await fs.writeFile(`${tmpDir}/index.html`, 'hello world', 'utf8')
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const workspaceUri = `file://${tmpDir}`

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
          output: [
            {
              arguments: '{}',
              call_id: 'call_01',
              id: 'fc_01',
              name: 'getWorkspaceUri',
              status: 'completed',
              type: 'function_call',
            },
            {
              arguments: JSON.stringify({ uri: `${workspaceUri}/index.html` }),
              call_id: 'call_02',
              id: 'fc_02',
              name: 'read_file',
              status: 'completed',
              type: 'function_call',
            },
            {
              arguments: JSON.stringify({ content: 'hello updated', path: 'index.html' }),
              call_id: 'call_03',
              id: 'fc_03',
              name: 'write_file',
              status: 'completed',
              type: 'function_call',
            },
          ],
          status: 'completed',
          text: {
            format: {
              type: 'text',
            },
            verbosity: 'medium',
          },
        },
        sequence_number: 1,
        type: 'response.completed',
      },
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('Please update index.html to say hello updated')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)

  // allow a short moment for the tool execution to complete and file to be written
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newContent = await fs.readFile(`${tmpDir}/index.html`, 'utf8')
  await expect(newContent).toBe('hello updated')
}
