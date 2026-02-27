import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems should render empty dom while initial', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), initial: true, uid: 1 }
  const result = RenderItems.renderItems(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetDom2, 1, []])
})

test('renderItems should render chat dom when initialized', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
    initial: false,
    uid: 2,
  }
  const result = RenderItems.renderItems(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(2)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})
