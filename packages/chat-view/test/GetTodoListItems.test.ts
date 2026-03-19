import { expect, test } from '@jest/globals'
import * as GetTodoListItems from '../src/parts/GetTodoListItems/GetTodoListItems.ts'

test('getTodoListItems should return empty array when selected session is missing', () => {
  const result = GetTodoListItems.getTodoListItems([], 'session-1')
  expect(result).toEqual([])
})

test('getTodoListItems should return todos from latest todo_list tool call', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant' as const,
          text: '',
          time: '',
          toolCalls: [
            {
              arguments: JSON.stringify({
                todos: [{ status: 'todo', text: 'Old item' }],
              }),
              name: 'todo_list',
            },
          ],
        },
        {
          id: 'message-2',
          role: 'assistant' as const,
          text: '',
          time: '',
          toolCalls: [
            {
              arguments: JSON.stringify({
                todos: [
                  { status: 'inProgress', text: 'Current item' },
                  { status: 'completed', text: 'Done item' },
                ],
              }),
              name: 'todo_list',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = GetTodoListItems.getTodoListItems(sessions, 'session-1')
  expect(result).toEqual([
    { status: 'inProgress', text: 'Current item' },
    { status: 'completed', text: 'Done item' },
  ])
})

test('getTodoListItems should ignore non todo_list tool calls', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant' as const,
          text: '',
          time: '',
          toolCalls: [
            {
              arguments: '{}',
              name: 'read_file',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]
  const result = GetTodoListItems.getTodoListItems(sessions, 'session-1')
  expect(result).toEqual([])
})
