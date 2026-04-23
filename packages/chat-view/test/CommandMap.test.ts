import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('commandMap should expose getComposerSelection as a wrapped getter', async () => {
  const uid = 991
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 2,
    composerSelectionStart: 7,
    composerValue: 'hello',
  }

  StatusBarStates.set(uid, state, state)

  const result = await commandMap['Chat.getComposerSelection'](uid)
  expect(result).toEqual([2, 5])
})
