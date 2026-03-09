import { expect, test } from '@jest/globals'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('saveState should persist serializable state fields', () => {
  const state = {
    ...createDefaultState(),
    filterValue: 'error',
    height: 200,
    sessionId: 'session-1',
    showEventStreamFinishedEvents: false,
    showInputEvents: false,
    showResponsePartEvents: false,
    width: 300,
    x: 1,
    y: 2,
  }
  const result = SaveState.saveState(state)

  expect(result).toEqual({
    filterValue: 'error',
    height: 200,
    sessionId: 'session-1',
    showEventStreamFinishedEvents: false,
    showInputEvents: false,
    showResponsePartEvents: false,
    width: 300,
    x: 1,
    y: 2,
  })
})
