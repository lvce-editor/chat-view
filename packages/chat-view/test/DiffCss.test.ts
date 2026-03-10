import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

test('isEqual should return true when initial is unchanged', () => {
  const oldState: ChatState = { ...createDefaultState(), initial: true }
  const newState: ChatState = { ...createDefaultState(), initial: true }
  expect(DiffCss.isEqual(oldState, newState)).toBe(true)
})

test('isEqual should return false when initial changes', () => {
  const oldState: ChatState = { ...createDefaultState(), initial: true }
  const newState: ChatState = { ...createDefaultState(), initial: false }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when custom-ui css changes for selected session', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: '1',
            role: 'assistant',
            text: '<custom-ui><html><div class="a">A</div></html><css>.a { color: red; }</css></custom-ui>',
            time: '',
          },
        ],
        title: 'Session 1',
      },
    ],
  }
  const newState: ChatState = {
    ...oldState,
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: '1',
            role: 'assistant',
            text: '<custom-ui><html><div class="a">A</div></html><css>.a { color: blue; }</css></custom-ui>',
            time: '',
          },
        ],
        title: 'Session 1',
      },
    ],
  }

  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})
