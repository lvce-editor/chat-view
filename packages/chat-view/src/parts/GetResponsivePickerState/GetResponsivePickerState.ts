export const minimumWidthForRunModePicker = 520
export const minimumWidthForAgentModePicker = 640

export interface ResponsivePickerState {
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
}

export const getResponsivePickerState = (width: number): ResponsivePickerState => {
  return {
    hasSpaceForAgentModePicker: width >= minimumWidthForAgentModePicker,
    hasSpaceForRunModePicker: width >= minimumWidthForRunModePicker,
  }
}
