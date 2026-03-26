import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-tool-calls-ordered-list-marker'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
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
        arguments: '{"path":"one.txt"}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      arguments: '{"path":"one.txt"}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"one.txt"}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 4,
      type: 'response.output_item.done',
    },
    {
      item: {
        arguments: '{"path":"two.txt"}',
        call_id: 'call_02',
        id: 'fc_02',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 5,
      type: 'response.output_item.added',
    },
    {
      arguments: '{"path":"two.txt"}',
      item_id: 'fc_02',
      output_index: 1,
      sequence_number: 6,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"two.txt"}',
        call_id: 'call_02',
        id: 'fc_02',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 7,
      type: 'response.output_item.done',
    },
    {
      item: {
        arguments: '{"path":"three.txt"}',
        call_id: 'call_03',
        id: 'fc_03',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 2,
      sequence_number: 8,
      type: 'response.output_item.added',
    },
    {
      arguments: '{"path":"three.txt"}',
      item_id: 'fc_03',
      output_index: 2,
      sequence_number: 9,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"three.txt"}',
        call_id: 'call_03',
        id: 'fc_03',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 2,
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
            arguments: '{"path":"one.txt"}',
            call_id: 'call_01',
            id: 'fc_01',
            name: 'read_file',
            status: 'completed',
            type: 'function_call',
          },
          {
            arguments: '{"path":"two.txt"}',
            call_id: 'call_02',
            id: 'fc_02',
            name: 'read_file',
            status: 'completed',
            type: 'function_call',
          },
          {
            arguments: '{"path":"three.txt"}',
            call_id: 'call_03',
            id: 'fc_03',
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
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('read three files')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('read three files')
  await expect(messages.nth(1)).toContainText('read_file one.txt')
  await expect(messages.nth(1)).toContainText('read_file two.txt')
  await expect(messages.nth(1)).toContainText('read_file three.txt')

  const markers = Locator('.ChatMessages .Message .ChatToolCalls .ChatOrderedListMarker')
  await expect(markers).toHaveCount(3)
  await expect(markers.nth(0)).toHaveText('1.')
  await expect(markers.nth(1)).toHaveText('2.')
  await expect(markers.nth(2)).toHaveText('3.')
}
