import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderScrollTop from '../src/parts/RenderScrollTop/RenderScrollTop.ts'

test('renderScrollTop should return empty array when no scroll values change', () => {
  const oldState = createDefaultState()
  const newState = createDefaultState()
  const result = RenderScrollTop.renderScrollTop(oldState, newState)
  expect(result).toEqual([])
})

test('renderScrollTop should return patches command when chat list scroll changes', () => {
  const oldState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    uid: 1,
    viewMode: 'list' as const,
  }
  const newState = {
    ...oldState,
    chatListScrollTop: 90,
  }
  const result = RenderScrollTop.renderScrollTop(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(1)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderScrollTop should return patches command when messages scroll changes', () => {
  const oldState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [{ id: 'm1', role: 'user' as const, text: 'hello', time: '10:30' }],
        title: 'Chat 1',
      },
    ],
    uid: 2,
    viewMode: 'detail' as const,
  }
  const newState = {
    ...oldState,
    messagesScrollTop: 180,
  }
  const result = RenderScrollTop.renderScrollTop(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(2)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})
