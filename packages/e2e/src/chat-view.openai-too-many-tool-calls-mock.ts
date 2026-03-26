import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-too-many-tool-calls-mock'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const loopingResponseSseParts = [
    {
      response: {
        created_at: 1,
        id: 'resp_loop',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'in_progress',
      },
      sequence_number: 0,
      type: 'response.created',
    },
    {
      item: {
        arguments: '{}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'get_workspace_uri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 1,
      type: 'response.output_item.added',
    },
    {
      arguments: '{}',
      item_id: 'fc_01',
      output_index: 0,
      sequence_number: 2,
      type: 'response.function_call_arguments.done',
    },
    {
      item: {
        arguments: '{}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'get_workspace_uri',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 3,
      type: 'response.output_item.done',
    },
    {
      response: {
        created_at: 1,
        id: 'resp_loop',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [
          {
            arguments: '{}',
            call_id: 'call_01',
            id: 'fc_01',
            name: 'get_workspace_uri',
            status: 'completed',
            type: 'function_call',
          },
        ],
        status: 'completed',
      },
      sequence_number: 4,
      type: 'response.completed',
    },
  ]

  for (let i = 0; i < 10; i++) {
    for (const responsePart of loopingResponseSseParts) {
      await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
    }
    await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  }
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('inspect workspace repeatedly')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request ended after 10 tool-call rounds without a final assistant response.')
  await expect(messages.nth(1)).toContainText('model got stuck in a tool loop')
}
