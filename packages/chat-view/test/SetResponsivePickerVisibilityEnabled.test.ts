import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetResponsivePickerVisibilityEnabled from '../src/parts/SetResponsivePickerVisibilityEnabled/SetResponsivePickerVisibilityEnabled.ts'

const getPrimaryControlWidths = (state: ChatState): readonly number[] => {
  const chevronWidth = state.selectChevronEnabled ? state.primaryControlSelectIconGap + state.primaryControlSelectIconSize : 0
  return [state.agentModePickerLabelWidth + chevronWidth, state.modelPickerLabelWidth + chevronWidth, state.runModePickerLabelWidth + chevronWidth]
}

const getComposerWidthForPrimaryControls = (state: ChatState, visibleControlCount: number, includeOverflowButton: boolean): number => {
  const widths = getPrimaryControlWidths(state).slice(0, visibleControlCount)
  const controlsWidth = widths.reduce((total, width, index) => {
    return total + width + (index === 0 ? 0 : state.primaryControlsGap)
  }, 0)
  let overflowWidth = 0
  if (includeOverflowButton) {
    overflowWidth = state.primaryControlsOverflowButtonLabelWidth
    if (visibleControlCount > 0) {
      overflowWidth += state.primaryControlsGap
    }
  }
  return (
    state.chatSendAreaPaddingLeft +
    state.chatSendAreaPaddingRight +
    state.primaryControlsSubmitButtonWidth +
    state.primaryControlsGap +
    controlsWidth +
    overflowWidth
  )
}

test('setResponsivePickerVisibilityEnabled should enable responsive picker visibility', () => {
  const state = {
    ...createDefaultState(),
    width: 800,
  }
  const result = SetResponsivePickerVisibilityEnabled.setResponsivePickerVisibilityEnabled(state, true)
  expect(result.responsivePickerVisibilityEnabled).toBe(true)
  expect(result.hasSpaceForAgentModePicker).toBe(true)
  expect(result.hasSpaceForRunModePicker).toBe(true)
})

test('setResponsivePickerVisibilityEnabled should hide optional pickers on narrow widths when enabling', () => {
  const defaultState = createDefaultState()
  const state = {
    ...defaultState,
    agentModePickerOpen: true,
    runModePickerOpen: true,
    width: getComposerWidthForPrimaryControls(defaultState, 0, true),
  }
  const result = SetResponsivePickerVisibilityEnabled.setResponsivePickerVisibilityEnabled(state, true)
  expect(result.agentModePickerOpen).toBe(false)
  expect(result.runModePickerOpen).toBe(false)
  expect(result.hasSpaceForAgentModePicker).toBe(false)
  expect(result.hasSpaceForRunModePicker).toBe(false)
})

test('setResponsivePickerVisibilityEnabled should restore optional picker visibility when disabling', () => {
  const state = {
    ...createDefaultState(),
    hasSpaceForAgentModePicker: false,
    hasSpaceForRunModePicker: false,
    responsivePickerVisibilityEnabled: true,
    width: 1,
  }
  const result = SetResponsivePickerVisibilityEnabled.setResponsivePickerVisibilityEnabled(state, false)
  expect(result.responsivePickerVisibilityEnabled).toBe(false)
  expect(result.hasSpaceForAgentModePicker).toBe(true)
  expect(result.hasSpaceForRunModePicker).toBe(true)
})
