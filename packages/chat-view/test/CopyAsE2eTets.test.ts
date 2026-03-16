import { expect, test } from '@jest/globals'
import { copyAsE2eTets } from '../src/parts/CopyAsE2eTets/CopyAsE2eTets.ts'

test('copyAsE2eTets should generate e2e test from chat message events', () => {
  const output = copyAsE2eTets([
    {
      sessionId: 'session-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      type: 'chat-message-added',
      message: {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
    },
    {
      sessionId: 'session-1',
      timestamp: '2026-01-01T00:00:01.000Z',
      type: 'chat-message-added',
      message: {
        id: 'message-2',
        inProgress: true,
        role: 'assistant',
        text: '',
        time: '10:01',
      },
    },
    {
      sessionId: 'session-1',
      timestamp: '2026-01-01T00:00:02.000Z',
      type: 'chat-message-updated',
      inProgress: false,
      messageId: 'message-2',
      text: 'hello from assistant',
      time: '10:01',
    },
  ])

  expect(output).toContain("await Command.execute('Chat.mockOpenApiStreamPushChunk', \"hello from assistant\")")
  expect(output).toContain("await Chat.handleInput(\"hello\")")
  expect(output).toContain('await expect(messages).toHaveCount(2)')
  expect(output).toContain('await expect(messages.nth(1)).toContainText("hello from assistant")')
})
