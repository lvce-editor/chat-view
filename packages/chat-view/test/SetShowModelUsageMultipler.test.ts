import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetShowModelUsageMultiplier from '../src/parts/SetShowModelUsageMultiplier/SetShowModelUsageMultiplier.ts'

test('setShowModelUsageMultiplier should set showModelUsageMultiplier to false', () => {
  const state = createDefaultState()
  const result = SetShowModelUsageMultiplier.setShowModelUsageMultiplier(state, false)
  expect(result.showModelUsageMultiplier).toBe(false)
})
