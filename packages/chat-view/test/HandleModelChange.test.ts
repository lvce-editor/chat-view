import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleModelChange from '../src/parts/HandleModelChange/HandleModelChange.ts'

test('handleModelChange should update selected model id', async () => {
  const state = createDefaultState()
  const result = await HandleModelChange.handleModelChange(state, 'claude-code')
  expect(result.selectedModelId).toBe('claude-code')
})

test('handleModelChange should close and clear model picker state', async () => {
  const state = {
    ...createDefaultState(),
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
  }
  const result = await HandleModelChange.handleModelChange(state, 'claude-code')
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.visibleModels).toBe(result.models)
})
