import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MockOpenApiStream from '../src/parts/MockOpenApiStream/MockOpenApiStream.ts'
import { registerMockResponse } from '../src/parts/RegisterMockResponse/RegisterMockResponse.ts'

test('registerMockResponse should enqueue text and finish mock stream', async () => {
  const state = createDefaultState()

  const result = registerMockResponse(state, {
    text: 'hello from e2e mock',
  })

  const firstChunk = await MockOpenApiStream.readNextChunk()
  const nextChunk = await MockOpenApiStream.readNextChunk()

  expect(result).toBe(state)
  expect(firstChunk).toBe('hello from e2e mock')
  expect(nextChunk).toBeUndefined()
})
