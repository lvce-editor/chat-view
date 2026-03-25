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

test('isEqual should return false when render_html css changes for selected session', () => {
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
            text: '',
            time: '',
            toolCalls: [
              {
                arguments: JSON.stringify({ css: '.a { color: red; }', html: '<div class="a">A</div>' }),
                name: 'render_html',
              },
            ],
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
            text: '',
            time: '',
            toolCalls: [
              {
                arguments: JSON.stringify({ css: '.a { color: blue; }', html: '<div class="a">A</div>' }),
                name: 'render_html',
              },
            ],
          },
        ],
        title: 'Session 1',
      },
    ],
  }

  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when textAreaPaddingTop changes', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), textAreaPaddingTop: 1 }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when chatSendAreaPaddingTop changes', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), chatSendAreaPaddingTop: 11 }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when chatFocusContentMaxWidth changes', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), chatFocusContentMaxWidth: 840 }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})
