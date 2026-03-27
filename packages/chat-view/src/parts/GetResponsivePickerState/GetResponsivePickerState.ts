export const minimumWidthForRunModePicker = 520
export const minimumWidthForAgentModePicker = 640

export interface ResponsivePickerState {
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
}

const fullyVisibleResponsivePickerState: ResponsivePickerState = {
  hasSpaceForAgentModePicker: true,
  hasSpaceForRunModePicker: true,
}

export const getResponsivePickerState = (width: number, responsivePickerVisibilityEnabled: boolean): ResponsivePickerState => {
  if (!responsivePickerVisibilityEnabled) {
    return fullyVisibleResponsivePickerState
  }
  return {
    hasSpaceForAgentModePicker: width >= minimumWidthForAgentModePicker,
    hasSpaceForRunModePicker: width >= minimumWidthForRunModePicker,
  }
}
