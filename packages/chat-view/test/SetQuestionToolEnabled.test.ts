import { expect, test } from '@jest/globals'
import * as SetQuestionToolEnabled from '../src/parts/SetQuestionToolEnabled/SetQuestionToolEnabled.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('setQuestionToolEnabled should set questionToolEnabled to true', () => {
  const state = createDefaultState()
  const result = SetQuestionToolEnabled.setQuestionToolEnabled(state, true)
  expect(result.questionToolEnabled).toBe(true)
})

test('setQuestionToolEnabled should set questionToolEnabled to false', () => {
  const state = createDefaultState()
  const result = SetQuestionToolEnabled.setQuestionToolEnabled(
    {
      ...state,
      questionToolEnabled: true,
    },
    false,
  )
  expect(result.questionToolEnabled).toBe(false)
})
