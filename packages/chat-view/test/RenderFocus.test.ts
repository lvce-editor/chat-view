import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'

test('renderFocus should return focusSelector command for composer', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="composer"]'])
})

test('renderFocus should return focusSelector command for send button', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'send-button', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="send"]'])
})

test('renderFocus should return focusSelector command for model picker search when opening new picker', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: false,
    newChatModelPickerEnabled: true,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
    newChatModelPickerEnabled: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="model-picker-search"]'])
})
