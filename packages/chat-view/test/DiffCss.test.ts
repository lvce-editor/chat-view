import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

test('isEqual should return true when initial is unchanged', () => {
  const oldState: StatusBarState = { ...createDefaultState(), initial: true }
  const newState: StatusBarState = { ...createDefaultState(), initial: true }
  expect(DiffCss.isEqual(oldState, newState)).toBe(true)
})

test('isEqual should return false when initial changes', () => {
  const oldState: StatusBarState = { ...createDefaultState(), initial: true }
  const newState: StatusBarState = { ...createDefaultState(), initial: false }
  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})
