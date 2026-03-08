import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatDebugViewState } from '../src/parts/State/ChatDebugViewState.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('renderItems should show count for visible events', () => {
  const oldState: ChatDebugViewState = createDefaultState()
  const newState: ChatDebugViewState = {
    ...createDefaultState(),
    events: [
      {
        sessionId: 'session-1',
        timestamp: '2026-03-08T00:00:00.000Z',
        type: 'request',
      },
      {
        sessionId: 'session-1',
        timestamp: '2026-03-08T00:00:01.000Z',
        type: 'handle-input',
      },
    ],
    sessionId: 'session-1',
    showInputEvents: false,
    uid: 1,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(1)
  expect(Array.isArray(result[2])).toBe(true)
  const dom = result[2] as readonly { readonly text?: string }[]
  const eventCountText = dom.find((node) => node.text === '1 event')
  expect(eventCountText).toBeDefined()
})

test('renderItems should show plural count when multiple events are visible', () => {
  const oldState: ChatDebugViewState = createDefaultState()
  const newState: ChatDebugViewState = {
    ...createDefaultState(),
    events: [
      {
        sessionId: 'session-1',
        timestamp: '2026-03-08T00:00:00.000Z',
        type: 'request',
      },
      {
        sessionId: 'session-1',
        timestamp: '2026-03-08T00:00:01.000Z',
        type: 'response',
      },
    ],
    sessionId: 'session-1',
    uid: 2,
  }

  const result = RenderItems.renderItems(oldState, newState)

  const dom = result[2] as readonly { readonly text?: string }[]
  const eventCountText = dom.find((node) => node.text === '2 events')
  expect(eventCountText).toBeDefined()
})

test('renderItems should use numeric eventId starting at 1 per session', () => {
  const oldState: ChatDebugViewState = createDefaultState()
  const newState: ChatDebugViewState = {
    ...createDefaultState(),
    events: [
      {
        eventId: 42,
        sessionId: 'session-1',
        timestamp: 'a',
        type: 'request',
      },
      {
        eventId: 99,
        sessionId: 'session-1',
        timestamp: 'b',
        type: 'response',
      },
    ],
    sessionId: 'session-1',
    uid: 3,
  }

  const result = RenderItems.renderItems(oldState, newState)

  const dom = result[2] as readonly { readonly text?: string }[]
  const eventIdKeys = dom.filter((node) => node.text === '"eventId"')
  expect(eventIdKeys).toHaveLength(2)
  expect(dom.some((node) => node.text === '1')).toBe(true)
  expect(dom.some((node) => node.text === '2')).toBe(true)
  expect(dom.some((node) => node.text === '42')).toBe(false)
  expect(dom.some((node) => node.text === '99')).toBe(false)
})
