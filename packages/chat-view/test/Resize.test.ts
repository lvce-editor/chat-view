import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Resize from '../src/parts/Resize/Resize.ts'

test('resize should merge dimensions into state', () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
  }
  const result = Resize.resize(state, dimensions)
  expect((result as any).width).toBe(100)
  expect((result as any).height).toBe(50)
  expect(result.uid).toBe(1)
})

test('resize should preserve existing state properties', () => {
  const state: ChatState = {
    ...createDefaultState(),
    disposed: true,
    uid: 5,
  }
  const dimensions = {
    width: 200,
  }
  const result = Resize.resize(state, dimensions)
  expect((result as any).width).toBe(200)
  expect(result.uid).toBe(5)
  expect(result.disposed).toBe(true)
})

test('resize should overwrite existing properties in dimensions', () => {
  const state: ChatState = {
    ...createDefaultState(),
    uid: 1,
  }
  const dimensions = {
    uid: 10,
    width: 300,
  }
  const result = Resize.resize(state, dimensions)
  expect(result.uid).toBe(10)
  expect((result as any).width).toBe(300)
})

test('resize should handle empty dimensions', () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {}
  const result = Resize.resize(state, dimensions)
  expect(result).toEqual(state)
  expect(result.uid).toBe(1)
})

test('resize should not mutate original state', () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
  }
  const originalUid = state.uid
  Resize.resize(state, dimensions)
  expect(state.uid).toBe(originalUid)
  expect((state as any).width).toBeUndefined()
  expect((state as any).height).toBeUndefined()
})

test('resize should handle multiple dimension properties', () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
    x: 10,
    y: 20,
  }
  const result = Resize.resize(state, dimensions)
  expect((result as any).width).toBe(100)
  expect((result as any).height).toBe(50)
  expect((result as any).x).toBe(10)
  expect((result as any).y).toBe(20)
  expect(result.uid).toBe(1)
})
