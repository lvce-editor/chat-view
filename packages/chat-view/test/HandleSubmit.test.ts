import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'

test('handleSubmit should delegate to chat view model worker', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async (state: ChatState) => ({
      ...state,
      composerValue: '',
      selectedSessionId: 'session-2',
      sessions: [...state.sessions, { id: 'session-2', messages: [], title: 'Chat 2' }],
      viewMode: 'detail',
    }),
  })
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }

  const result = await HandleSubmit.handleSubmit(state)

  expect(result).toEqual({
    ...state,
    composerValue: '',
    selectedSessionId: 'session-2',
    sessions: [...state.sessions, { id: 'session-2', messages: [], title: 'Chat 2' }],
    viewMode: 'detail',
  })
  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})

test('handleSubmit should normalize object-shaped worker errors', async () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => {
      throw {
        message: 'missing attachments',
      }
    },
  })
  const state = { ...createDefaultState(), composerValue: 'hello from e2e' }

  await expect(HandleSubmit.handleSubmit(state)).rejects.toThrow('missing attachments')

  expect(mockRpc.invocations).toEqual([['ChatModel.handleSubmit', state]])
})
