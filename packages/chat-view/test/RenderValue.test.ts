import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { OpenApiApiKeyInput } from '../src/parts/OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenRouterApiKeyInput } from '../src/parts/OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import * as RenderValue from '../src/parts/RenderValue/RenderValue.ts'

test('renderValue should return setValueByName command for composer', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    uid: 7,
  }
  const result = RenderValue.renderValue(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetValueByName, 7, 'composer', 'hello'])
})

test('renderValue should return setValueByName command for openai api key input', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    openApiApiKeyInput: 'invalid-key',
    uid: 7,
  }
  const result = RenderValue.renderValue(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetValueByName, 7, OpenApiApiKeyInput, 'invalid-key'])
})

test('renderValue should return setValueByName command for openrouter api key input', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    openRouterApiKeyInput: 'or-key-typed',
    uid: 7,
  }
  const result = RenderValue.renderValue(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetValueByName, 7, OpenRouterApiKeyInput, 'or-key-typed'])
})
