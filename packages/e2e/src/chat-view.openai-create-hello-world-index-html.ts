import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-hello-world-index-html'

interface MockOpenApiRequest {
  readonly payload: unknown
}

const assertEqual = <T>(actual: T, expected: T, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()

  const indexHtmlContent = `<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`
  const writeFileArgs = JSON.stringify({
    content: indexHtmlContent,
    path: 'index.html',
  })

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
        arguments: writeFileArgs,
        call_id: 'call_02',
        id: 'fc_02',
        name: 'write_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 5,
      type: 'response.output_item.added',
    },
    {
      arguments: writeFileArgs,
      item_id: 'fc_02',
      output_index: 1,
      sequence_number: 6,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: writeFileArgs,
        call_id: 'call_02',
        id: 'fc_02',
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
            arguments: writeFileArgs,
            call_id: 'call_02',
            id: 'fc_02',
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
      delta: 'Created index.html with Hello World.',
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

  for (const responsePart of firstResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')

  for (const responsePart of secondResponseSseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('create a hello world index html file')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('create a hello world index html file')
  await expect(messages.nth(1)).toHaveText('Created index.html with Hello World.')

  const indexHtmlPath = `${tmpDir}/index.html`
  const actualContent = await FileSystem.readFile(indexHtmlPath)
  assertEqual(actualContent, indexHtmlContent, 'index.html content')

  const requests = (await Chat.mockOpenApiRequestGetAll()) as readonly MockOpenApiRequest[]
  assertEqual(requests.length, 2, 'OpenAI request count')

  const secondPayload = requests[1].payload as {
    readonly input: readonly {
      readonly call_id: string
      readonly output: string
      readonly type: string
    }[]
    readonly previous_response_id: string
  }
  assertEqual(secondPayload.previous_response_id, 'resp_01', 'second request previous_response_id')
  assertEqual(secondPayload.input.length, 2, 'second request input length')
  assertEqual(secondPayload.input[0].type, 'function_call_output', 'second request first input type')
  assertEqual(secondPayload.input[0].call_id, 'call_01', 'second request first call id')
  assertEqual(secondPayload.input[1].type, 'function_call_output', 'second request second input type')
  assertEqual(secondPayload.input[1].call_id, 'call_02', 'second request second call id')
}
