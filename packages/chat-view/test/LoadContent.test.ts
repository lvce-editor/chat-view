import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should delegate to chat view model worker', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.loadContent': async (state: ChatState, savedState: unknown) => ({
      ...state,
      composerValue:
        savedState && typeof savedState === 'object' && 'composerValue' in savedState && typeof savedState.composerValue === 'string'
          ? savedState.composerValue
          : state.composerValue,
      initial: false,
      selectedSessionId: 'session-2',
      sessions: [...state.sessions, { id: 'session-2', messages: [], title: 'Chat 2' }],
      viewMode: 'detail',
    }),
  })
  const state = { ...createDefaultState(), uid: 1 }
  const savedState = { composerValue: 'saved composer' }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result).toEqual({
    ...state,
    composerValue: 'saved composer',
    initial: false,
    selectedSessionId: 'session-2',
    sessions: [...state.sessions, { id: 'session-2', messages: [], title: 'Chat 2' }],
    viewMode: 'detail',
  })
  expect(mockRpc.invocations).toEqual([['ChatModel.loadContent', state, savedState]])
})
