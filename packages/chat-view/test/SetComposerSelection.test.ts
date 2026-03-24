import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetComposerSelection from '../src/parts/SetComposerSelection/SetComposerSelection.ts'

test('setComposerSelection should update selection in state', () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello world',
  }
  const result = SetComposerSelection.setComposerSelection(state, 1, 4)
  expect(result.composerSelectionStart).toBe(1)
  expect(result.composerSelectionEnd).toBe(4)
})

test('setComposerSelection should clamp selection to composer bounds', () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = SetComposerSelection.setComposerSelection(state, -10, 100)
  expect(result.composerSelectionStart).toBe(0)
  expect(result.composerSelectionEnd).toBe(5)
})

test('setComposerSelection should normalize reversed selection range', () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello world',
  }
  const result = SetComposerSelection.setComposerSelection(state, 7, 2)
  expect(result.composerSelectionStart).toBe(2)
  expect(result.composerSelectionEnd).toBe(7)
})
