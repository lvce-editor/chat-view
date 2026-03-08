import { expect, test } from '@jest/globals'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('saveState should persist serializable state fields', () => {
  const state = {
    ...createDefaultState(),
    filterValue: 'error',
    sessionId: 'session-1',
    showInputEvents: false,
    x: 1,
    y: 2,
    width: 300,
    height: 200,
  }
  const result = SaveState.saveState(state)

  expect(result).toEqual({
    filterValue: 'error',
    sessionId: 'session-1',
    showInputEvents: false,
    x: 1,
    y: 2,
    width: 300,
    height: 200,
  })
})
