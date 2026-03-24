import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetSelectedComposerValue from '../src/parts/GetSelectedComposerValue/GetSelectedComposerValue.ts'

test('getSelectedComposerValue should return selected composer text', () => {
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 11,
    composerSelectionStart: 6,
    composerValue: 'hello world',
  }
  expect(GetSelectedComposerValue.getSelectedComposerValue(state)).toBe('world')
})

test('getSelectedComposerValue should return empty string when selection is collapsed', () => {
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 3,
    composerSelectionStart: 3,
    composerValue: 'hello world',
  }
  expect(GetSelectedComposerValue.getSelectedComposerValue(state)).toBe('')
})
