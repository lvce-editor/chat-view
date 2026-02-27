import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInputFocus from '../src/parts/HandleInputFocus/HandleInputFocus.ts'

test('handleInputFocus should set input focus for composer', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'composer')
  expect(result).toEqual({
    ...state,
    focus: 'composer',
    focused: true,
  })
})

test('handleInputFocus should set focused false for unknown element', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'other')
  expect(result).toEqual({
    ...state,
    focused: false,
  })
})

test('handleInputFocus should set list focus for session element', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'session:session-1')
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
  })
})

test('handleInputFocus should set header focus for header action', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'settings')
  expect(result).toEqual({
    ...state,
    focus: 'header',
    focused: true,
  })
})

test('handleInputFocus should set send button focus for send', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'send')
  expect(result).toEqual({
    ...state,
    focus: 'send-button',
    focused: true,
  })
})
