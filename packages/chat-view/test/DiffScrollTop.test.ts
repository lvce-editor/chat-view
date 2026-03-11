import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffScrollTop from '../src/parts/DiffScrollTop/DiffScrollTop.ts'

test('diffScrollTop should return true when both scroll positions are equal', () => {
  const oldState = createDefaultState()
  const newState = createDefaultState()
  const result = DiffScrollTop.diffScrollTop(oldState, newState)
  expect(result).toBe(true)
})

test('diffScrollTop should return false when chat list scroll position changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    chatListScrollTop: 120,
  }
  const result = DiffScrollTop.diffScrollTop(oldState, newState)
  expect(result).toBe(false)
})

test('diffScrollTop should return false when messages scroll position changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    messagesScrollTop: 200,
  }
  const result = DiffScrollTop.diffScrollTop(oldState, newState)
  expect(result).toBe(false)
})

test('diffScrollTop should return false when project list scroll position changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    projectListScrollTop: 160,
  }
  const result = DiffScrollTop.diffScrollTop(oldState, newState)
  expect(result).toBe(false)
})
