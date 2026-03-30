import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickCustomSelectOverlay } from '../src/parts/HandleClickCustomSelectOverlay/HandleClickCustomSelectOverlay.ts'

test('handleClickCustomSelectOverlay should close custom pickers and git branch errors', async () => {
  const state = {
    ...createDefaultState(),
    agentModePickerOpen: true,
    gitBranchPickerErrorMessage: 'Failed to load git branches.',
    gitBranchPickerOpen: true,
    reasoningEffortPickerOpen: true,
    runModePickerOpen: true,
  }
  const result = await handleClickCustomSelectOverlay(state, false)
  expect(result.agentModePickerOpen).toBe(false)
  expect(result.gitBranchPickerErrorMessage).toBe('')
  expect(result.gitBranchPickerOpen).toBe(false)
  expect(result.reasoningEffortPickerOpen).toBe(false)
  expect(result.runModePickerOpen).toBe(false)
})

test('handleClickCustomSelectOverlay should ignore prevented events', async () => {
  const state = {
    ...createDefaultState(),
    agentModePickerOpen: true,
  }
  const result = await handleClickCustomSelectOverlay(state, true)
  expect(result).toBe(state)
})
