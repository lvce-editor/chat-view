import { expect, test } from '@jest/globals'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('handleInput should update filter value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.Filter, 'error', false)
  expect(result.filterValue).toBe('error')
})

test('handleInput should set showInputEvents to true for on value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowInputEvents, '', 'on')
  expect(result.showInputEvents).toBe(true)
})

test('handleInput should set showInputEvents to false for unchecked value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowInputEvents, '', false)
  expect(result.showInputEvents).toBe(false)
})

test('handleInput should keep state for unknown input name', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, 'unknown', 'value', false)
  expect(result).toBe(state)
})
