import { expect, test } from '@jest/globals'
import { copyAsE2eTests } from '../src/parts/CopyAsE2eTests/CopyAsE2eTests.ts'

test('copyAsE2eTests should generate e2e test from chat message events', () => {
  const output = copyAsE2eTests([
    {
      message: {
        id: 'message-1',
        role: 'user',
        text: 'hello',
        time: '10:00',
      },
      sessionId: 'session-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      type: 'chat-message-added',
    },
    {
      message: {
        id: 'message-2',
        inProgress: true,
        role: 'assistant',
        text: '',
        time: '10:01',
      },
      sessionId: 'session-1',
      timestamp: '2026-01-01T00:00:01.000Z',
      type: 'chat-message-added',
    },
    {
      inProgress: false,
      messageId: 'message-2',
      sessionId: 'session-1',
      text: 'hello from assistant',
      time: '10:01',
      timestamp: '2026-01-01T00:00:02.000Z',
      type: 'chat-message-updated',
    },
  ])

  expect(output).toContain("await Command.execute('Chat.mockOpenApiStreamPushChunk', \"hello from assistant\")")
  expect(output).toContain("await Chat.handleInput(\"hello\")")
  expect(output).toContain('await expect(messages).toHaveCount(2)')
  expect(output).toContain('await expect(messages.nth(1)).toContainText("hello from assistant")')
})
