import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
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

test('renderItems should honor visible primary controls from state', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    hiddenPrimaryControls: ['model-picker-toggle', 'run-mode-picker-toggle'],
    initial: false,
    primaryControlsOverflowButtonVisible: true,
    uid: 3,
    visiblePrimaryControls: ['agent-mode-picker-toggle'],
  }
  const result = RenderItems.renderItems(oldState, newState)
  const dom = result[2]
  const primaryControls = dom.find((node: any) => node.className === ClassNames.ChatSendAreaPrimaryControls)
  const agentModePickerToggle = dom.find((node: any) => node.name === 'agent-mode-picker-toggle')
  const modelPickerToggle = dom.find((node: any) => node.name === 'model-picker-toggle')
  const overflowToggle = dom.find((node: any) => node.name === 'primary-controls-overflow')
  expect(primaryControls).toMatchObject({
    childCount: 2,
    className: ClassNames.ChatSendAreaPrimaryControls,
  })
  expect(agentModePickerToggle).toBeDefined()
  expect(modelPickerToggle).toBeUndefined()
  expect(overflowToggle).toBeDefined()
})
