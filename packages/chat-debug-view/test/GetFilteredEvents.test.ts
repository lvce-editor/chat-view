import { expect, test } from '@jest/globals'
import type { ChatViewEvent } from '../src/parts/ChatViewEvent/ChatViewEvent.ts'
import * as GetFilteredEvents from '../src/parts/GetFilteredEvents/GetFilteredEvents.ts'

const events: readonly ChatViewEvent[] = [
  {
    name: 'filter',
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:00:00.000Z',
    type: 'handle-input',
  },
  {
    path: '/chat',
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:01:00.000Z',
    type: 'request',
  },
  {
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:02:00.000Z',
    type: 'sse-response-part',
    value: {
      type: 'response.output_text.delta',
    },
  },
  {
    sessionId: 'session-1',
    timestamp: '2026-01-01T10:03:00.000Z',
    type: 'event-stream-finished',
  },
]

test('getFilteredEvents should hide input events when showInputEvents is false', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '', false, true, false)
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe('request')
})

test('getFilteredEvents should hide response part events when showResponsePartEvents is false', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '', true, false, false)
  expect(result).toHaveLength(2)
  expect(result.some((event) => event.type === 'request')).toBe(true)
  expect(result.some((event) => event.type === 'sse-response-part')).toBe(false)
})

test('getFilteredEvents should hide event-stream-finished events by default', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '', true, true, false)
  expect(result.some((event) => event.type === 'event-stream-finished')).toBe(false)
})

test('getFilteredEvents should show event-stream-finished events when enabled', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '', true, true, true)
  expect(result.some((event) => event.type === 'event-stream-finished')).toBe(true)
})

test('getFilteredEvents should filter by normalized search text', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '  REQUEST  ', true, true, true)
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe('request')
})

test('getFilteredEvents should return all visible events when filter is empty', () => {
  const result = GetFilteredEvents.getFilteredEvents(events, '   ', true, true, true)
  expect(result).toHaveLength(4)
})
