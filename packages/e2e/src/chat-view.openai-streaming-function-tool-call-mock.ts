/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-function-tool-call-mock'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

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
        arguments: '',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'read_file',
        status: 'in_progress',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      delta: '{"',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: 'path',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 4,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '":"',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 5,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: 'index',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 6,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '.html',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 7,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '"}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 8,
      type: 'response.function_call_arguments.delta',
    },
    {
      arguments: '{"path":"index.html"}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 9,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"index.html"}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 10,
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
            arguments: '{"path":"index.html"}',
            call_id: 'call_01',
            id: 'fc_01',
            name: 'read_file',
            status: 'completed',
            type: 'function_call',
          },
        ],
        status: 'completed',
      },
      sequence_number: 11,
      type: 'response.completed',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('whats the contents of index html')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('whats the contents of index html')
  await expect(messages.nth(1)).toHaveText('toolsread_file index.html (error: Invalid argument: uri must be an absolute URI.)')
}
