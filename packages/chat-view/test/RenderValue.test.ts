import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderValue from '../src/parts/RenderValue/RenderValue.ts'

test('renderValue should return setValueByName command for composer', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    uid: 7,
  }
  const result = RenderValue.renderValue(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetValueByName, 7, 'composer', 'hello'])
})
