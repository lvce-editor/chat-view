import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetTodolistToolEnabled from '../src/parts/SetTodolistToolEnabled/SetTodolistToolEnabled.ts'

test('setTodolistToolEnabled should set todoListToolEnabled to true', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetTodolistToolEnabled.setTodolistToolEnabled(state, true)
  expect(result.todoListToolEnabled).toBe(true)
})

test('setTodolistToolEnabled should set todoListToolEnabled to false', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetTodolistToolEnabled.setTodolistToolEnabled(
    {
      ...state,
      todoListToolEnabled: true,
    },
    false,
  )
  expect(result.todoListToolEnabled).toBe(false)
})
