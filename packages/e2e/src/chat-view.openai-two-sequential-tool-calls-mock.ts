/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-two-sequential-tool-calls-mock'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content of file one')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content of file two')
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  // First API response: AI reads file1.txt
  const firstResponseSseParts = [
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
        arguments: '{"path":"file1.txt"}',
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
      arguments: '{"path":"file1.txt"}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"file1.txt"}',
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
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: '{"path":"file1.txt"}',
            call_id: 'call_01',
            id: 'fc_01',
            name: 'read_file',
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

  // Second API response: AI reads file2.txt
  const secondResponseSseParts = [
    {
      response: {
        created_at: 2,
        id: 'resp_02',
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
        created_at: 2,
        id: 'resp_02',
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
        arguments: '{"path":"file2.txt"}',
        call_id: 'call_02',
        id: 'fc_02',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      arguments: '{"path":"file2.txt"}',
      item_id: 'fc_02',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"file2.txt"}',
        call_id: 'call_02',
        id: 'fc_02',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 4,
      type: 'response.output_item.done',
    },
    {
      response: {
        created_at: 2,
        id: 'resp_02',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: '{"path":"file2.txt"}',
            call_id: 'call_02',
            id: 'fc_02',
            name: 'read_file',
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

  // Third API response: AI responds with text summarizing both files
  const thirdResponseSseParts = [
    {
      response: {
        created_at: 3,
        id: 'resp_03',
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
        created_at: 3,
        id: 'resp_03',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'in_progress',
      },
      sequence_number: 1,
      type: 'response.in_progress',
    },
    {
      delta: 'file1.txt says "content of file one" and file2.txt says "content of file two".',
      sequence_number: 2,
      type: 'response.output_text.delta',
    },
    {
      response: {
        created_at: 3,
        id: 'resp_03',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'completed',
      },
      sequence_number: 3,
      type: 'response.completed',
    },
  ]

  for (const responsePart of firstResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')

  for (const responsePart of secondResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')

  for (const responsePart of thirdResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('read file1.txt and file2.txt and tell me about them')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(0)).toHaveText('read file1.txt and file2.txt and tell me about them')
  await expect(messages.nth(1)).toHaveText('toolsread_file file1.txtread_file file2.txt')
  await expect(messages.nth(2)).toHaveText('file1.txt says "content of file one" and file2.txt says "content of file two".')
}
