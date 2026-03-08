import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderScrollTop from '../src/parts/RenderScrollTop/RenderScrollTop.ts'

test('renderScrollTop should return SetProperty command', () => {
  const oldState = createDefaultState()
  const newState = createDefaultState()
  const result = RenderScrollTop.renderScrollTop(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetProperty, 0, '.ChatMessages', 'scrollTop', 0])
})

test('renderScrollTop should target current uid', () => {
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
  expect(result[0]).toBe(ViewletCommand.SetProperty)
  expect(result[1]).toBe(1)
  expect(result[2]).toBe('.ChatMessages')
  expect(result[3]).toBe('scrollTop')
})

test('renderScrollTop should use messagesScrollTop value', () => {
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
  expect(result[0]).toBe(ViewletCommand.SetProperty)
  expect(result[1]).toBe(2)
  expect(result[2]).toBe('.ChatMessages')
  expect(result[3]).toBe('scrollTop')
  expect(result[4]).toBe(180)
})
