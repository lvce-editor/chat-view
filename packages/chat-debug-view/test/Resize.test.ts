import { expect, test } from '@jest/globals'
import * as Resize from '../src/parts/Resize/Resize.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('resize should merge provided dimensions into state', () => {
  const state = createDefaultState()
  const result = Resize.resize(state, {
    x: 10,
    y: 20,
    width: 300,
    height: 400,
  })

  expect(result.x).toBe(10)
  expect(result.y).toBe(20)
  expect(result.width).toBe(300)
  expect(result.height).toBe(400)
  expect(result.uid).toBe(state.uid)
})
