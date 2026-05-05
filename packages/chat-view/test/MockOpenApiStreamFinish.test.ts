import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamFinish } from '../src/parts/MockOpenApiStreamFinish/MockOpenApiStreamFinish.ts'

test('mockOpenApiStreamFinish should delegate to chat coordinator worker', () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiStreamFinish': async () => {},
  })
  const state = createDefaultState()

  const result = mockOpenApiStreamFinish(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockOpenApiStreamFinish']])
})
