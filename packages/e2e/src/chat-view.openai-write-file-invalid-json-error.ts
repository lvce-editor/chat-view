/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-invalid-json-error'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const invalidWriteFileArgs = '{"path":"index.html","content":"<html><body><h1>Hello World</h1></body></html>"'

  const sseResponseParts = [
    {
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'in_progress',
      },
      sequence_number: 0,
      type: 'response.created',
    },
    {
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'in_progress',
      },
      sequence_number: 1,
      type: 'response.in_progress',
    },
    {
      item: {
        arguments: invalidWriteFileArgs,
        call_id: 'call_01',
        id: 'fc_01',
        name: 'write_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      arguments: invalidWriteFileArgs,
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: invalidWriteFileArgs,
        call_id: 'call_01',
        id: 'fc_01',
        name: 'write_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 4,
      type: 'response.output_item.done',
    },
    {
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: invalidWriteFileArgs,
            call_id: 'call_01',
            id: 'fc_01',
            name: 'write_file',
            status: 'completed',
            type: 'function_call',
          },
        ],
        status: 'completed',
      },
      sequence_number: 5,
      type: 'response.completed',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('create a hello world index html file')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('create a hello world index html file')
  await expect(messages.nth(1)).toContainText('write_file')
  await expect(messages.nth(1)).toContainText('(error: Access denied: path must be relative and stay within the open workspace folder.)')
}
