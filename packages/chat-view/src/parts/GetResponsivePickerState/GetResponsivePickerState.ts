import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'

export const minimumWidthForRunModePicker = 520
export const minimumWidthForAgentModePicker = 640

export interface GetResponsivePickerStateOptions {
  readonly availablePrimaryControls: readonly ComposerPrimaryControl[]
  readonly chatSendAreaPaddingLeft: number
  readonly chatSendAreaPaddingRight: number
  readonly overflowButtonWidth: number
  readonly primaryControlGap: number
  readonly primaryControlWidths: Readonly<Record<ComposerPrimaryControl, number>>
  readonly responsivePickerVisibilityEnabled: boolean
  readonly submitButtonWidth: number
  readonly width: number
}

export interface ResponsivePickerState {
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
  readonly hiddenPrimaryControls: readonly ComposerPrimaryControl[]
  readonly primaryControlsOverflowButtonVisible: boolean
  readonly visiblePrimaryControls: readonly ComposerPrimaryControl[]
}

const fullyVisibleResponsivePickerState: ResponsivePickerState = {
  hasSpaceForAgentModePicker: true,
  hasSpaceForRunModePicker: true,
  hiddenPrimaryControls: [],
  primaryControlsOverflowButtonVisible: false,
  visiblePrimaryControls: [],
}

export const getResponsivePickerState = ({
  availablePrimaryControls,
  chatSendAreaPaddingLeft,
  chatSendAreaPaddingRight,
  overflowButtonWidth,
  primaryControlGap,
  primaryControlWidths,
  responsivePickerVisibilityEnabled,
  submitButtonWidth,
  width,
}: GetResponsivePickerStateOptions): ResponsivePickerState => {
  if (!responsivePickerVisibilityEnabled) {
    return {
      ...fullyVisibleResponsivePickerState,
      hasSpaceForAgentModePicker: availablePrimaryControls.includes('agent-mode-picker-toggle'),
      hasSpaceForRunModePicker: availablePrimaryControls.includes('run-mode-picker-toggle'),
      visiblePrimaryControls: availablePrimaryControls,
    }
  }
  const availableWidth = Math.max(0, width - chatSendAreaPaddingLeft - chatSendAreaPaddingRight - submitButtonWidth - primaryControlGap)
  const visiblePrimaryControls: ComposerPrimaryControl[] = []
  let usedWidth = 0
  let hiddenStartIndex = availablePrimaryControls.length
  for (let index = 0; index < availablePrimaryControls.length; index++) {
    const control = availablePrimaryControls[index]
    const controlWidth = primaryControlWidths[control]
    const nextWidth = usedWidth + (visiblePrimaryControls.length > 0 ? primaryControlGap : 0) + controlWidth
    const hasRemainingControls = index < availablePrimaryControls.length - 1
    const reservedOverflowWidth = hasRemainingControls ? primaryControlGap + overflowButtonWidth : 0
    if (nextWidth + reservedOverflowWidth <= availableWidth) {
      visiblePrimaryControls.push(control)
      usedWidth = nextWidth
      continue
    }
    hiddenStartIndex = index
    break
  }
  const hiddenPrimaryControls = availablePrimaryControls.slice(hiddenStartIndex)
  return {
    hasSpaceForAgentModePicker: visiblePrimaryControls.includes('agent-mode-picker-toggle'),
    hasSpaceForRunModePicker: visiblePrimaryControls.includes('run-mode-picker-toggle'),
    hiddenPrimaryControls,
    primaryControlsOverflowButtonVisible: hiddenPrimaryControls.length > 0,
    visiblePrimaryControls,
  }
}
