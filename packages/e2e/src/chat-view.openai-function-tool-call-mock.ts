/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-function-tool-call-mock'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const sseResponseParts = [
    {
      item: {
        arguments: '{"path":"README.md"}',
        call_id: 'call_01',
        id: 'fc_01',
        name: 'read_file',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 0,
      type: 'response.output_item.added',
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
      sequence_number: 1,
      type: 'response.completed',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('show readme')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('show readme')
  await expect(messages.nth(1)).toHaveText('toolsread_file README.md')
}
