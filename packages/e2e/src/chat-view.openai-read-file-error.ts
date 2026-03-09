/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-function-tool-call-mock'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', true)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const sseResponseParts = [
    {
      eventId: 96,
      sessionId: '01',
      timestamp: '2026-03-09T10:31:30.803Z',
      type: 'sse-response-completed',
      value: {
        response: {
          background: false,
          completed_at: 1_773_052_290,
          created_at: 1_773_052_289,
          error: null,
          frequency_penalty: 0,
          id: 'resp_01',
          incomplete_details: null,
          instructions: null,
          max_output_tokens: null,
          max_tool_calls: null,
          metadata: {},
          model: 'gpt-4.1-mini-2025-04-14',
          object: 'response',
          output: [
            {
              content: [
                {
                  annotations: [],
                  logprobs: [],
                  text: 'It seems I am unable to access the file "index.html" at the moment. Could you please provide the file or check if it\'s correctly placed in the workspace? Alternatively, you can paste the contents here and I can help you with it.',
                  type: 'output_text',
                },
              ],
              id: 'msg_01',
              role: 'assistant',
              status: 'completed',
              type: 'message',
            },
          ],
          parallel_tool_calls: true,
          presence_penalty: 0,
          previous_response_id: 'resp_01',
          prompt_cache_key: null,
          prompt_cache_retention: null,
          reasoning: {
            effort: null,
            summary: null,
          },
          safety_identifier: null,
          service_tier: 'default',
          status: 'completed',
          store: true,
          temperature: 1,
          text: {
            format: {
              type: 'text',
            },
            verbosity: 'medium',
          },
          tool_choice: 'auto',
          tools: [],
          top_logprobs: 0,
          top_p: 1,
          truncation: 'disabled',
          usage: {
            input_tokens: 538,
            input_tokens_details: {
              cached_tokens: 0,
            },
            output_tokens: 51,
            output_tokens_details: {
              reasoning_tokens: 0,
            },
            total_tokens: 589,
          },
          user: null,
        },
        sequence_number: 56,
        type: 'response.completed',
      },
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Command.execute('Chat.handleInput', 'composer', 'whats the contents of index html', 'script')
  await Command.execute('Chat.handleSubmit')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('whats the contents of index html')
  await expect(messages.nth(1)).toHaveText('read_file index.html')
}
