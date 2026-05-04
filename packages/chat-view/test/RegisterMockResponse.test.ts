import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { registerMockResponse } from '../src/parts/RegisterMockResponse/RegisterMockResponse.ts'

test('registerMockResponse should delegate to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.registerMockResponse': async () => {},
  })
  const state = createDefaultState()

  const result = registerMockResponse(state, {
    text: 'hello from e2e mock',
  })

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.registerMockResponse', { text: 'hello from e2e mock' }]])
})
