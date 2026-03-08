import { expect, test } from '@jest/globals'
import type { ChatViewEvent } from '../src/parts/ChatViewEvent/ChatViewEvent.ts'
import * as GetFilteredEvents from '../src/parts/GetFilteredEvents/GetFilteredEvents.ts'

const events: readonly ChatViewEvent[] = [
  {
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:00:00.000Z',
    type: 'handle-input',
    name: 'filter',
  },
  {
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:01:00.000Z',
    type: 'request',
    path: '/chat',
  },
]

test('getFilteredEvents should hide input events when showInputEvents is false', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '', false)
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe('request')
})

test('getFilteredEvents should filter by normalized search text', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '  REQUEST  ', true)
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe('request')
})

test('getFilteredEvents should return all visible events when filter is empty', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '   ', true)
  expect(result).toHaveLength(2)
})
