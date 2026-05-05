import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamPushChunk } from '../src/parts/MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'

test('mockOpenApiStreamPushChunk should delegate to chat coordinator worker', async () => {
  const state = createDefaultState()

  const result = await mockOpenApiStreamPushChunk(state, 'chunk-1')

  expect(result).toBe(state)
})
