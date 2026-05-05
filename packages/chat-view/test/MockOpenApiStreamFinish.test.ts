import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamPushChunk } from '../src/parts/MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'
import { mockOpenApiStreamFinish } from '../src/parts/MockOpenApiStreamFinish/MockOpenApiStreamFinish.ts'

test('mockOpenApiStreamFinish should delegate to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.registerMockResponse': async () => {},
  })
  const state = createDefaultState()
  await mockOpenApiStreamPushChunk(state, 'chunk-1')

  const result = await mockOpenApiStreamFinish(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.registerMockResponse', { text: 'chunk-1' }]])
})
