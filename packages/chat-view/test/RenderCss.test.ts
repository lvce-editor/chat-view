import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderCss from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss should return setCss command with uid and css', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
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
                arguments: JSON.stringify({ css: '.card{color:green;}', html: '<div class="card">ok</div>' }),
                name: 'render_html',
              },
            ],
          },
        ],
        title: 'Session 1',
      },
    ],
    uid: 42,
  }
  const result = RenderCss.renderCss(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetCss)
  expect(result[1]).toBe(42)
  expect(typeof result[2]).toBe('string')
  expect(result[2].length).toBeGreaterThan(0)
  expect(result[2]).toContain('--ChatTextAreaHeight: 28px;')
  expect(result[2]).toContain('--ChatFocusContentMaxWidth: 700px;')
  expect(result[2]).toContain('.ChatFocus .ChatMessages > .Message{')
  expect(result[2]).toContain('.ChatFocus .ChatMessages > .Message > .ChatMessageContent{')
  expect(result[2]).toContain('.ChatSendAreaBottom{')
  expect(result[2]).toContain('.card{color:green;}')
})
