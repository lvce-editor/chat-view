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

test('handleInput should set showEventStreamFinishedEvents to true for on value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowEventStreamFinishedEvents, '', 'on')
  expect(result.showEventStreamFinishedEvents).toBe(true)
})

test('handleInput should set showEventStreamFinishedEvents to false for unchecked value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowEventStreamFinishedEvents, '', false)
  expect(result.showEventStreamFinishedEvents).toBe(false)
})

test('handleInput should set showInputEvents to false for unchecked value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowInputEvents, '', false)
  expect(result.showInputEvents).toBe(false)
})

test('handleInput should set showResponsePartEvents to true for on value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowResponsePartEvents, '', 'on')
  expect(result.showResponsePartEvents).toBe(true)
})

test('handleInput should set showResponsePartEvents to false for unchecked value', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, InputName.ShowResponsePartEvents, '', false)
  expect(result.showResponsePartEvents).toBe(false)
})

test('handleInput should keep state for unknown input name', () => {
  const state = createDefaultState()
  const result = HandleInput.handleInput(state, 'unknown', 'value', false)
  expect(result).toBe(state)
})
