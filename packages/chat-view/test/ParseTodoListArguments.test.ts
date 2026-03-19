import { expect, test } from '@jest/globals'
import * as ParseTodoListArguments from '../src/parts/ParseTodoListArguments/ParseTodoListArguments.ts'

test('parseTodoListArguments should parse valid todos', () => {
  const rawArguments = JSON.stringify({
    todos: [
      { status: 'todo', text: 'Task 1' },
      { status: 'inProgress', text: 'Task 2' },
      { status: 'completed', text: 'Task 3' },
    ],
  })
  const result = ParseTodoListArguments.parseTodoListArguments(rawArguments)
  expect(result).toEqual([
    { status: 'todo', text: 'Task 1' },
    { status: 'inProgress', text: 'Task 2' },
    { status: 'completed', text: 'Task 3' },
  ])
})

test('parseTodoListArguments should return empty array for invalid json', () => {
  const result = ParseTodoListArguments.parseTodoListArguments('not-json')
  expect(result).toEqual([])
})

test('parseTodoListArguments should filter invalid entries', () => {
  const rawArguments = JSON.stringify({
    todos: [{ status: 'todo', text: 'Task 1' }, { status: 'unknown', text: 'Task 2' }, { status: 'completed', text: 1 }],
  })
  const result = ParseTodoListArguments.parseTodoListArguments(rawArguments)
  expect(result).toEqual([{ status: 'todo', text: 'Task 1' }])
})
