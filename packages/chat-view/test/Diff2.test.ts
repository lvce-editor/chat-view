import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('diff2 should return diff results for stored status bar states', () => {
  const uid = 902
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    composerSelectionEnd: 5,
    composerSelectionStart: 5,
    composerValue: 'hello',
    inputSource: 'script',
  }

  StatusBarStates.set(uid, oldState, newState)

  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderValue, DiffType.RenderSelection])
})
