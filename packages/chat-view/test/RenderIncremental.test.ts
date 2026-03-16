import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderIncremental from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('renderIncremental should fallback to full render when selected session tool calls changed', () => {
  const baseSession = {
    id: 'session-1',
    messages: [
      {
        id: 'm-1',
        role: 'assistant' as const,
        text: '',
        time: '10:00',
        toolCalls: [
          {
            arguments: '{"path":"a.txt"}',
            id: 'call_1',
            name: 'read_file',
          },
        ],
      },
    ],
    title: 'Chat 1',
  }
  const oldState: ChatState = {
    ...createDefaultState(),
    initial: false,
    selectedSessionId: 'session-1',
    sessions: [baseSession],
    uid: 1,
  }
  const newState: ChatState = {
    ...oldState,
    sessions: [
      {
        ...baseSession,
        messages: [
          ...baseSession.messages,
          {
            id: 'm-2',
            role: 'assistant' as const,
            text: '',
            time: '10:01',
            toolCalls: [
              {
                arguments: '{"path":"b.txt"}',
                id: 'call_2',
                name: 'read_file',
              },
            ],
          },
        ],
      },
    ],
  }

  const result = RenderIncremental.renderIncremental(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(1)
})
