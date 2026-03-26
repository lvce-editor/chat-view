import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-normal-interaction-with-tool-calls'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceUri = `file://${tmpDir}`
  await FileSystem.writeFile(`${tmpDir}/README.md`, '# Chat View Worker\n\nA web worker for chat view rendering.')
  await FileSystem.writeFile(`${tmpDir}/package.json`, '{"name":"tmp-project"}')

  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

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
      delta: 'Could you share a file or a project description so I can identify the project type?',
      sequence_number: 2,
      type: 'response.output_text.delta',
    },
    {
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'completed',
      },
      sequence_number: 3,
      type: 'response.completed',
    },
  ]

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
        arguments: JSON.stringify({ path: 'README.md' }),
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
      arguments: JSON.stringify({ path: 'README.md' }),
      item_id: 'fc_03',
      output_index: 2,
      sequence_number: 9,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: JSON.stringify({ path: 'README.md' }),
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
        created_at: 2,
        id: 'resp_02',
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
            arguments: JSON.stringify({ path: 'README.md' }),
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
      delta: 'This looks like a chat-view worker project with e2e coverage and TypeScript-based tooling.',
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

  await Chat.handleInput('what kind of project is this?')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('what kind of project is this?')
  await expect(messages.nth(1)).toContainText('Could you share a file or a project description')

  await Chat.handleInput('use tools')
  await Chat.handleSubmit()

  await expect(messages).toHaveCount(5)
  await expect(messages.nth(2)).toHaveText('use tools')
  await expect(messages.nth(3)).toContainText('get_workspace_uri')
  await expect(messages.nth(3)).toContainText('list_files')
  await expect(messages.nth(3)).toContainText('read_file README.md')
  await expect(messages.nth(4)).toContainText('chat-view worker project')
}
