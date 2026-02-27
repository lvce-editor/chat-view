import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusInput from '../src/parts/FocusInput/FocusInput.ts'

test('focusInput should set focus to composer and focused true', () => {
  const state = { ...createDefaultState(), focused: false, focus: 'send-button' }
  const result = FocusInput.focusInput(state)
  expect(result).toEqual({
    ...state,
    focus: 'composer',
    focused: true,
  })
})
