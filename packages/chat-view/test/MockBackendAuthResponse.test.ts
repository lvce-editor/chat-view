import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockBackendAuthResponse } from '../src/parts/MockBackendAuthResponse/MockBackendAuthResponse.ts'

test('mockBackendAuthResponse should delegate to chat model worker', () => {
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.mockBackendAuthResponse': async () => {},
  })
  const state = createDefaultState()
  const payload = {
    accessToken: 'backend-token',
    request: 'refresh' as const,
    type: 'success' as const,
    userName: 'Test',
  }

  const result = mockBackendAuthResponse(state, payload)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatModel.mockBackendAuthResponse', payload]])
})
