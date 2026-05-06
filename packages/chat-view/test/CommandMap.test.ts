import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'
import { registerMockQuickPickRpc } from '../src/parts/TestHelpers/RegisterMockQuickPickRpc.ts'

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

test('commandMap should expose handleClickRename as a wrapped command', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  using mockQuickPickRpc = registerMockQuickPickRpc({
    'QuickPick.showQuickInput': async () => ({
      canceled: false,
      inputValue: 'Renamed Chat',
    }),
  })
  const uid = 992
  const state = createDefaultState()

  StatusBarStates.set(uid, state, state)

  await commandMap['Chat.handleClickRename'](uid, 'session-1')
  const result = StatusBarStates.get(uid)?.newState
  expect(result?.sessions[0].title).toBe('Renamed Chat')
  expect(mockQuickPickRpc.invocations).toEqual([['QuickPick.showQuickInput', { initialValue: 'Chat 1', waitUntil: 'finished' }]])
  expect(mockChatStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Renamed Chat' }],
  ])
})
