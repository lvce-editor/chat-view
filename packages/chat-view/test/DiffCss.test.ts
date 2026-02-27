import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

test('isEqual should return true when initial is unchanged', () => {
  const oldState: ChatState = { ...createDefaultState(), initial: true }
  const newState: ChatState = { ...createDefaultState(), initial: true }
  expect(DiffCss.isEqual(oldState, newState)).toBe(true)
})

test('isEqual should return false when initial changes', () => {
  const oldState: ChatState = { ...createDefaultState(), initial: true }
  const newState: ChatState = { ...createDefaultState(), initial: false }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})
