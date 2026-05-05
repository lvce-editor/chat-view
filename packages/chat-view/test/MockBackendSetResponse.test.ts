import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockBackendSetResponse } from '../src/parts/MockBackendSetResponse/MockBackendSetResponse.ts'

test('mockBackendSetResponse should delegate to chat coordinator worker', () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockBackendSetResponse': async () => {},
  })
  const state = createDefaultState()
  const body = {
    id: 'resp_invalid',
    output: [],
    status: 'completed',
  }

  const result = mockBackendSetResponse(state, body)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockBackendSetResponse', body]])
})