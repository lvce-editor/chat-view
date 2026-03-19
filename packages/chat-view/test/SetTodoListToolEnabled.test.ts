import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetTodoListToolEnabled from '../src/parts/SetTodoListToolEnabled/SetTodoListToolEnabled.ts'

test('setTodoListToolEnabled should set todoListToolEnabled to true', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetTodoListToolEnabled.setTodoListToolEnabled(state, true)
  expect(result.todoListToolEnabled).toBe(true)
})

test('setTodoListToolEnabled should set todoListToolEnabled to false', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetTodoListToolEnabled.setTodoListToolEnabled(
    {
      ...state,
      todoListToolEnabled: true,
    },
    false,
  )
  expect(result.todoListToolEnabled).toBe(false)
})
