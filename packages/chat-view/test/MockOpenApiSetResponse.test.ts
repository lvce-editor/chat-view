import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiSetResponse } from '../src/parts/MockOpenApiSetResponse/MockOpenApiSetResponse.ts'
import * as MockOpenApiStream from '../src/parts/MockOpenApiStream/MockOpenApiStream.ts'

test('mockOpenApiSetResponse should queue a structured mock response and delegate to chat coordinator worker', async () => {
  using mockRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.mockOpenApiSetResponse': async () => {},
  })
  const state = createDefaultState()
  const responseBody = {
    toolCall: {
      arguments: {
        uri: 'file:///workspace/generated-folder',
      },
      name: 'create_directory',
    },
  }

  const result = await mockOpenApiSetResponse(state, responseBody)
  const requestId = MockOpenApiStream.startRequest()

  expect(result).toBe(state)
  expect(requestId).toBe('default')
  await expect(MockOpenApiStream.readNextChunk(requestId)).resolves.toBe(JSON.stringify(responseBody))
  await expect(MockOpenApiStream.readNextChunk(requestId)).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['ChatCoordinator.mockOpenApiSetResponse', responseBody]])
})
