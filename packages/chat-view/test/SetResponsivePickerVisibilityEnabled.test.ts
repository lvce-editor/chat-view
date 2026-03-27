import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { minimumWidthForAgentModePicker, minimumWidthForRunModePicker } from '../src/parts/GetResponsivePickerState/GetResponsivePickerState.ts'
import * as SetResponsivePickerVisibilityEnabled from '../src/parts/SetResponsivePickerVisibilityEnabled/SetResponsivePickerVisibilityEnabled.ts'

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
  const state = {
    ...createDefaultState(),
    agentModePickerOpen: true,
    runModePickerOpen: true,
    width: minimumWidthForRunModePicker - 1,
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
    width: minimumWidthForAgentModePicker - 1,
  }
  const result = SetResponsivePickerVisibilityEnabled.setResponsivePickerVisibilityEnabled(state, false)
  expect(result.responsivePickerVisibilityEnabled).toBe(false)
  expect(result.hasSpaceForAgentModePicker).toBe(true)
  expect(result.hasSpaceForRunModePicker).toBe(true)
})
