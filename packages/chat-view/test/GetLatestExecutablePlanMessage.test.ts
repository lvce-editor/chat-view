import { expect, test } from '@jest/globals'
import {
  getLatestExecutablePlanMessage,
  isExecutablePlanMessage,
} from '../src/parts/GetLatestExecutablePlanMessage/GetLatestExecutablePlanMessage.ts'

test('isExecutablePlanMessage should accept a completed plan reply without tool failures', () => {
  const result = isExecutablePlanMessage({
    agentMode: 'plan',
    id: 'message-1',
    role: 'assistant',
    text: '1. Inspect files\n2. Implement change',
    time: '10:00',
  })

  expect(result).toBe(true)
})

test('isExecutablePlanMessage should reject plan replies with failed tool calls', () => {
  const result = isExecutablePlanMessage({
    agentMode: 'plan',
    id: 'message-1',
    role: 'assistant',
    text: "I can't make a reliable plan.",
    time: '10:00',
    toolCalls: [
      {
        arguments: '{}',
        errorMessage: 'File not found: src/missing.ts',
        name: 'read_file',
        status: 'not-found',
      },
    ],
  })

  expect(result).toBe(false)
})

test('getLatestExecutablePlanMessage should only use the latest assistant reply', () => {
  const result = getLatestExecutablePlanMessage({
    id: 'session-1',
    messages: [
      {
        agentMode: 'plan',
        id: 'message-1',
        role: 'assistant',
        text: 'Earlier plan',
        time: '10:00',
      },
      {
        id: 'message-2',
        role: 'user',
        text: 'please implement it',
        time: '10:01',
      },
      {
        agentMode: 'agent',
        id: 'message-3',
        role: 'assistant',
        text: 'Implemented it',
        time: '10:02',
      },
    ],
    title: 'Chat 1',
  })

  expect(result).toBeUndefined()
})
