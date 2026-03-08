import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-function-tool-call-mock'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', true)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const sseResponseParts = [
    {
      response: {
        created_at: 1,
        id: 'resp_069caeeab667c6270069adef235be8819781d32c936ce85fe1',
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
        id: 'resp_069caeeab667c6270069adef235be8819781d32c936ce85fe1',
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
        call_id: 'call_hTsImEnE2J15oHE1JfFMUdQP',
        id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
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
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 3,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: 'path',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 4,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '":"',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 5,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: 'index',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 6,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '.html',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 7,
      type: 'response.function_call_arguments.delta',
    },
    {
      delta: '"}',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 8,
      type: 'response.function_call_arguments.delta',
    },
    {
      arguments: '{"path":"index.html"}',
      item_id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
      output_index: 0,
      sequence_number: 9,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{"path":"index.html"}',
        call_id: 'call_hTsImEnE2J15oHE1JfFMUdQP',
        id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
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
        id: 'resp_069caeeab667c6270069adef235be8819781d32c936ce85fe1',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: '{"path":"index.html"}',
            call_id: 'call_hTsImEnE2J15oHE1JfFMUdQP',
            id: 'fc_069caeeab667c6270069adef240bb08197b5d1c77023543d54',
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

  await Command.execute('Chat.handleInput', 'composer', 'whats the contents of index html', 'script')
  await Command.execute('Chat.handleSubmit')

  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toContainText('whats the contents of index html')
  await expect(messages.nth(1)).toContainText('read_file "index.html"')
}
