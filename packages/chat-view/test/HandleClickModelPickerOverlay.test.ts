import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickModelPickerOverlay } from '../src/parts/HandleClickModelPickerOverlay/HandleClickModelPickerOverlay.ts'

test.skip('handleClickModelPickerOverlay should close model picker and focus composer', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    focus: 'model-picker-input',
    focused: false,
    listFocusedIndex: 2,
    modelPickerListScrollTop: 40,
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
  }
  const result = await handleClickModelPickerOverlay(state, false)
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(result.listFocusedIndex).toBe(-1)
  expect(result.modelPickerListScrollTop).toBe(0)
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.visibleModels).toBe(result.models)
})
