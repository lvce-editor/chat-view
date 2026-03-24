import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderSelection from '../src/parts/RenderSelection/RenderSelection.ts'

test('renderSelection should return setSelectionByName command for composer', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    composerSelectionEnd: 8,
    composerSelectionStart: 2,
    uid: 7,
  }
  const result = RenderSelection.renderSelection(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetSelectionByName, 7, 'composer', 2, 8])
})
