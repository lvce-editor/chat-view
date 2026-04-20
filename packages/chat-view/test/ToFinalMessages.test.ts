import { expect, test } from '@jest/globals'
import { toFinalMessages } from '../src/parts/ToFinalMessages/ToFinalMessages.ts'

test('toFinalMessages should parse handle-submit and ai-response-success events', () => {
  const result = toFinalMessages([
    {
      requestId: 'turn-1',
      sessionId: 'session-1',
      timestamp: '2026-04-20T09:39:00.961Z',
      type: 'handle-submit',
      value: '1',
    },
    {
      body: {
        input: [{ content: '1', role: 'user' }],
        model: 'gpt-4o-mini',
      },
      headers: {
        Authorization: 'Bearer [redacted]',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      requestId: 'request-1',
      sessionId: 'session-1',
      timestamp: '2026-04-20T09:39:00.963Z',
      turnId: 'turn-1',
      type: 'ai-request',
    },
    {
      requestId: 'request-2',
      sessionId: 'session-1',
      timestamp: '2026-04-20T09:39:01.000Z',
      turnId: 'turn-1',
      type: 'ai-response-success',
      value: {
        id: 'resp_1',
        object: 'response',
        output: [
          {
            content: [
              {
                text: '2',
                type: 'output_text',
              },
            ],
            type: 'message',
          },
        ],
        status: 'completed',
      },
    },
  ])

  expect(result).toEqual([
    {
      id: 'turn-1',
      role: 'user',
      text: '1',
      time: '2026-04-20T09:39:00.961Z',
    },
    {
      id: 'request-2',
      role: 'assistant',
      text: '2',
      time: '2026-04-20T09:39:01.000Z',
    },
  ])
})
