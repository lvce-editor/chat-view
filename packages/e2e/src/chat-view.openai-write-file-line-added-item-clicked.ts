import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-line-added-item-clicked'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const notesUri = encodeURI(`file://${tmpDir}/notes.txt`)
  await FileSystem.writeFile(`${tmpDir}/notes.txt`, 'alpha\nbeta')
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const sseResponseParts = [
    {
      response: {
        background: false,
        completed_at: 1,
        created_at: 1,
        error: null,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        output: [
          {
            arguments: JSON.stringify({ content: 'alpha\nbeta\ngamma', uri: notesUri }),
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
  ]

  for (const responsePart of sseResponseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('add one line to notes.txt')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('add one line to notes.txt')
  await expect(messages.nth(1)).toContainText('write_file notes.txt')
}
