import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamPushChunk } from '../src/parts/MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'

test('mockOpenApiStreamPushChunk should delegate to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiStreamPushChunk': async () => {},
  })
  const state = createDefaultState()

  const result = await mockOpenApiStreamPushChunk(state, 'chunk-1')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockOpenApiStreamPushChunk', 'chunk-1']])
})
