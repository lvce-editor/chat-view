import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleReasoningEffortChange from '../src/parts/HandleReasoningEffortChange/HandleReasoningEffortChange.ts'

test('handleReasoningEffortChange should update the reasoning effort', async () => {
  const state = {
    ...createDefaultState(),
    reasoningEffortPickerOpen: true,
  }
  const result = await HandleReasoningEffortChange.handleReasoningEffortChange(state, 'extra-high')
  expect(result.reasoningEffort).toBe('extra-high')
  expect(result.reasoningEffortPickerOpen).toBe(false)
})

test('handleReasoningEffortChange should ignore invalid reasoning effort values', async () => {
  const state = createDefaultState()
  const result = await HandleReasoningEffortChange.handleReasoningEffortChange(state, 'turbo')
  expect(result).toBe(state)
})
