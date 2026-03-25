import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-line-added'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/notes.txt`, 'alpha\nbeta')
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

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
              arguments: JSON.stringify({ content: 'alpha\nbeta\ngamma', path: 'notes.txt' }),
              call_id: 'call_01',
              id: 'fc_01',
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

  await Chat.handleInput('add one line to notes.txt')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('add one line to notes.txt')
  await expect(messages.nth(1)).toHaveText('write_file notes.txt +1 -0')

  const newContent = await FileSystem.readFile(`${tmpDir}/notes.txt`)
  if (newContent !== 'alpha\nbeta\ngamma') {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(`Expected updated file content to be "alpha\\nbeta\\ngamma", got "${newContent}"`)
  }
}
