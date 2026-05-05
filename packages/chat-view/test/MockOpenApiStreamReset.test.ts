import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamReset } from '../src/parts/MockOpenApiStreamReset/MockOpenApiStreamReset.ts'

test('mockOpenApiStreamReset should delegate to chat coordinator worker', () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiStreamReset': async () => {},
  })
  const state = createDefaultState()

  const result = mockOpenApiStreamReset(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockOpenApiStreamReset']])
})
