import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { mockOpenApiStreamReset } from '../src/parts/MockOpenApiStreamReset/MockOpenApiStreamReset.ts'

test('mockOpenApiStreamReset should delegate to chat coordinator worker', async () => {
  const state = createDefaultState()

  const result = await mockOpenApiStreamReset(state)

  expect(result).toBe(state)
})
