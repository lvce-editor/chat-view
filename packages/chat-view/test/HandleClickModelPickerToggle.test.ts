import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickModelPickerToggle } from '../src/parts/HandleClickModelPickerToggle/HandleClickModelPickerToggle.ts'

test('handleClickModelPickerToggle should open model picker', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: false,
  }
  const result = await handleClickModelPickerToggle(state)
  expect(result.modelPickerOpen).toBe(true)
})

test('handleClickModelPickerToggle should close model picker and clear search', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
  }
  const result = await handleClickModelPickerToggle(state)
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
})
