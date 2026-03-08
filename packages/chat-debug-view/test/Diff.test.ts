import { expect, test } from '@jest/globals'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('diff should return RenderCss and RenderItems when initial changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    initial: false,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderCss, DiffType.RenderItems])
})

test('diff should return RenderItems when filter changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    filterValue: 'error',
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return empty array when no observed properties change', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})
