import { expect, test } from '@jest/globals'
import * as GetSavedComposerSelection from '../src/parts/GetSavedComposerSelection/GetSavedComposerSelection.ts'

test('getSavedComposerSelection should restore a valid selection range', () => {
  const savedState = {
    composerSelectionEnd: 6,
    composerSelectionStart: 2,
  }
  const result = GetSavedComposerSelection.getSavedComposerSelection(savedState, 'hello world')
  expect(result).toEqual([2, 6])
})

test('getSavedComposerSelection should normalize reversed saved selection', () => {
  const savedState = {
    composerSelectionEnd: 2,
    composerSelectionStart: 6,
  }
  const result = GetSavedComposerSelection.getSavedComposerSelection(savedState, 'hello world')
  expect(result).toEqual([2, 6])
})

test('getSavedComposerSelection should clamp saved selection to composer bounds', () => {
  const savedState = {
    composerSelectionEnd: 100,
    composerSelectionStart: -5,
  }
  const result = GetSavedComposerSelection.getSavedComposerSelection(savedState, 'hello')
  expect(result).toEqual([0, 5])
})

test('getSavedComposerSelection should ignore invalid saved selection values', () => {
  const savedState = {
    composerSelectionEnd: 'bad',
    composerSelectionStart: 1,
  }
  const result = GetSavedComposerSelection.getSavedComposerSelection(savedState, 'hello')
  expect(result).toBeUndefined()
})
