import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-line-removed'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/notes.txt`, 'alpha\nbeta\ngamma')
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
          output: [
            {
              arguments: JSON.stringify({ content: 'alpha\nbeta', path: 'notes.txt' }),
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
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('remove one line from notes.txt')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText('remove one line from notes.txt')
  const message1 = messages.nth(1)
  await expect(message1).toContainText('write_file notes.txt +0 -1')

  await new Promise((resolve) => setTimeout(resolve, 200))

  const newContent = await FileSystem.readFile(`${tmpDir}/notes.txt`)
  if (newContent !== 'alpha\nbeta') {
    throw new Error(`Expected updated file content to be "alpha\\nbeta", got "${newContent}"`)
  }
}
