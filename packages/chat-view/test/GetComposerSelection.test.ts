import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetComposerSelection from '../src/parts/GetComposerSelection/GetComposerSelection.ts'

test('getComposerSelection should return normalized composer selection', () => {
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 2,
    composerSelectionStart: 7,
    composerValue: 'hello',
  }

  expect(GetComposerSelection.getComposerSelection(state)).toEqual([2, 5])
})
