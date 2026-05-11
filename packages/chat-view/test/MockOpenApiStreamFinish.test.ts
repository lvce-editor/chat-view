import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamFinish } from '../src/parts/MockOpenApiStreamFinish/MockOpenApiStreamFinish.ts'
import { mockOpenApiStreamPushChunk } from '../src/parts/MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'

test('mockOpenApiStreamFinish should delegate to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiStreamPushChunk': async () => { },
    'ChatCoordinator.mockOpenApiStreamFinish': async () => { },
  })
  const state = createDefaultState()
  await mockOpenApiStreamPushChunk(state, 'chunk-1')

  const result = await mockOpenApiStreamFinish(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([
    ['ChatCoordinator.mockOpenApiStreamPushChunk', 'chunk-1'],
    ['ChatCoordinator.mockOpenApiStreamFinish'],
  ])
})

test('mockOpenApiStreamFinish should not delegate named requests to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiStreamPushChunk': async () => { },
    'ChatCoordinator.mockOpenApiStreamFinish': async () => { },
  })
  const state = createDefaultState()
  await mockOpenApiStreamPushChunk(state, 'request-1', 'chunk-1')

  const result = await mockOpenApiStreamFinish(state, 'request-1')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})
