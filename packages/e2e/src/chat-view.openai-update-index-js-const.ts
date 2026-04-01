/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-update-index-js-const'

export const skip = 1

const assertEqual = <T>(actual: T, expected: T, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceUri = `file://${tmpDir}`
  const initialContent = `//frontendcode\n\nlet mysecretApiKey = "123456";`
  const updatedContent = `//frontendcode\n\nconst mysecretApiKey = "123456";`
  await FileSystem.writeFile(`${tmpDir}/index.js`, initialContent)
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const firstToolResponseSseParts = [
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
        arguments: '{}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'getWorkspaceUri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      arguments: '{}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'getWorkspaceUri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 4,
      type: 'response.output_item.done',
    },
    {
      item: {
        arguments: JSON.stringify({ uri: workspaceUri }),
        call_id: 'call_02',
        id: 'fc_02',
        name: 'list_files',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 5,
      type: 'response.output_item.added',
    },
    {
      arguments: JSON.stringify({ uri: workspaceUri }),
      item_id: 'fc_02',
      output_index: 1,
      sequence_number: 6,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: JSON.stringify({ uri: workspaceUri }),
        call_id: 'call_02',
        id: 'fc_02',
        name: 'list_files',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 7,
      type: 'response.output_item.done',
    },
    {
      item: {
        arguments: JSON.stringify({ path: 'index.js' }),
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
      arguments: JSON.stringify({ path: 'index.js' }),
      item_id: 'fc_03',
      output_index: 2,
      sequence_number: 9,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: JSON.stringify({ path: 'index.js' }),
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
            arguments: '{}',
            call_id: 'call_01',
            id: 'fc_01',
            name: 'getWorkspaceUri',
            status: 'completed',
            type: 'function_call',
          },
          {
            arguments: JSON.stringify({ uri: workspaceUri }),
            call_id: 'call_02',
            id: 'fc_02',
            name: 'list_files',
            status: 'completed',
            type: 'function_call',
          },
          {
            arguments: JSON.stringify({ path: 'index.js' }),
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

  const firstTextResponseSseParts = [
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
      delta:
        'I\'ve found the content of your index.js file. Here\'s an updated version using const instead of let:\n\n//frontendcode\n\nconst mysecretApiKey = "123456";\n\nShould I go ahead and update the file with this change?',
      sequence_number: 2,
      type: 'response.output_text.delta',
    },
    {
      response: {
        created_at: 2,
        id: 'resp_02',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'completed',
      },
      sequence_number: 3,
      type: 'response.completed',
    },
  ]

  const secondToolResponseSseParts = [
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
      item: {
        arguments: '{}',
        call_id: 'call_04',
        id: 'fc_04',
        name: 'getWorkspaceUri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      arguments: '{}',
      item_id: 'fc_04',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{}',
        call_id: 'call_04',
        id: 'fc_04',
        name: 'getWorkspaceUri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 4,
      type: 'response.output_item.done',
    },
    {
      item: {
        arguments: JSON.stringify({ content: updatedContent, path: 'index.js' }),
        call_id: 'call_05',
        id: 'fc_05',
        name: 'write_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 5,
      type: 'response.output_item.added',
    },
    {
      arguments: JSON.stringify({ content: updatedContent, path: 'index.js' }),
      item_id: 'fc_05',
      output_index: 1,
      sequence_number: 6,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: JSON.stringify({ content: updatedContent, path: 'index.js' }),
        call_id: 'call_05',
        id: 'fc_05',
        name: 'write_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 7,
      type: 'response.output_item.done',
    },
    {
      response: {
        created_at: 3,
        id: 'resp_03',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: '{}',
            call_id: 'call_04',
            id: 'fc_04',
            name: 'getWorkspaceUri',
            status: 'completed',
            type: 'function_call',
          },
          {
            arguments: JSON.stringify({ content: updatedContent, path: 'index.js' }),
            call_id: 'call_05',
            id: 'fc_05',
            name: 'write_file',
            status: 'completed',
            type: 'function_call',
          },
        ],
        status: 'completed',
      },
      sequence_number: 8,
      type: 'response.completed',
    },
  ]

  const secondTextResponseSseParts = [
    {
      response: {
        created_at: 4,
        id: 'resp_04',
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
        created_at: 4,
        id: 'resp_04',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'in_progress',
      },
      sequence_number: 1,
      type: 'response.in_progress',
    },
    {
      delta: 'The index.js file has been updated to use const.',
      sequence_number: 2,
      type: 'response.output_text.delta',
    },
    {
      response: {
        created_at: 4,
        id: 'resp_04',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'completed',
      },
      sequence_number: 3,
      type: 'response.completed',
    },
  ]

  for (const responsePart of firstToolResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  for (const responsePart of firstTextResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  for (const responsePart of secondToolResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  for (const responsePart of secondTextResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('update index js')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(1)).toContainText('get_workspace_uri')
  await expect(messages.nth(1)).toContainText('list_files')
  await expect(messages.nth(1)).toContainText('read_file index.js')
  await expect(messages.nth(2)).toContainText('const mysecretApiKey = "123456";')
  await expect(messages.nth(2)).toContainText('Should I go ahead and update the file with this change?')

  await Chat.handleInput('yes')
  await Chat.handleSubmit()

  await expect(messages).toHaveCount(6)
  await expect(messages.nth(4)).toContainText('get_workspace_uri')
  await expect(messages.nth(4)).toContainText('write_file index.js')
  await expect(messages.nth(5)).toContainText('The index.js file has been updated to use const.')

  const actualContent = await FileSystem.readFile(`${tmpDir}/index.js`)
  assertEqual(actualContent, updatedContent, 'index.js content')
}
