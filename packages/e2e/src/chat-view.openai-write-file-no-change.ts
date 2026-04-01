import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-no-change'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const initialContent = 'alpha\nbeta'
  await FileSystem.writeFile(`${tmpDir}/notes.txt`, initialContent)
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
              arguments: JSON.stringify({ content: initialContent, path: 'notes.txt' }),
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

  await Chat.handleInput('rewrite notes.txt with the same content')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('rewrite notes.txt with the same content')
  await expect(messages.nth(1)).toContainText('write_file notes.txt +0 -0')

  await new Promise((resolve) => setTimeout(resolve, 200))

  const newContent = await FileSystem.readFile(`${tmpDir}/notes.txt`)
  if (newContent !== initialContent) {
    throw new Error(`Expected file content to remain "${initialContent}", got "${newContent}"`)
  }
}
