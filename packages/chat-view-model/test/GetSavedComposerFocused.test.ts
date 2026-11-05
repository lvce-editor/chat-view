import { expect, test } from '@jest/globals'
import { getSavedComposerFocused } from '../src/parts/GetSavedComposerFocused/GetSavedComposerFocused.ts'

test('returns true for saved composer focus ownership', () => {
  expect(getSavedComposerFocused({ composerFocused: true })).toBe(true)
})

test('returns false when saved focus ownership is missing or invalid', () => {
  expect(getSavedComposerFocused(undefined)).toBe(false)
  expect(getSavedComposerFocused({ composerFocused: false })).toBe(false)
  expect(getSavedComposerFocused({ composerFocused: 'true' })).toBe(false)
})
