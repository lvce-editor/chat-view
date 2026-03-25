import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleModelInputBlur } from '../src/parts/HandleModelInputBlur/HandleModelInputBlur.ts'

test('handleModelInputBlur should close the model picker when focus leaves the picker', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    focus: 'model-picker-input',
    focused: true,
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
  }

  const result = await handleModelInputBlur(state)

  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.visibleModels).toBe(result.models)
})

test('handleModelInputBlur should close model picker', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
  }
  const result = await handleModelInputBlur(state)
  expect(result.modelPickerOpen).toBe(false)
})

test('handleModelInputBlur should clear model picker search value', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
  }
  const result = await handleModelInputBlur(state)
  expect(result.modelPickerSearchValue).toBe('')
})

test('handleModelInputBlur should focus composer input', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
  }
  const result = await handleModelInputBlur(state)
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
})

test('handleModelInputBlur should do nothing when model picker is already closed', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: false,
  }
  const result = await handleModelInputBlur(state)
  expect(result).toBe(state)
})
