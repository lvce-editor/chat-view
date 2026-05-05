import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockBackendSetHttpErrorResponse } from '../src/parts/MockBackendSetHttpErrorResponse/MockBackendSetHttpErrorResponse.ts'

test('mockBackendSetHttpErrorResponse should delegate to chat coordinator worker', () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockBackendSetHttpErrorResponse': async () => {},
  })
  const state = createDefaultState()
  const body = {
    error: 'Backend overloaded.',
  }

  const result = mockBackendSetHttpErrorResponse(state, 503, body)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockBackendSetHttpErrorResponse', 503, body]])
})