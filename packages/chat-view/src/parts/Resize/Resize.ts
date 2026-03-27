import type { ChatState } from '../ChatState/ChatState.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'
import { getResponsivePickerState } from '../GetResponsivePickerState/GetResponsivePickerState.ts'

type GetComposerHeightFn = (state: ChatState, value: string, width: number) => Promise<number>

export const resize = async (state: ChatState, dimensions: any, getComposerHeightFn: GetComposerHeightFn = getComposerHeight): Promise<ChatState> => {
  const responsivePickerState =
    dimensions.width === undefined ? undefined : getResponsivePickerState(dimensions.width, state.responsivePickerVisibilityEnabled)
  const responsivePickerOpenState = responsivePickerState
    ? {
        agentModePickerOpen: responsivePickerState.hasSpaceForAgentModePicker ? state.agentModePickerOpen : false,
        runModePickerOpen: responsivePickerState.hasSpaceForRunModePicker ? state.runModePickerOpen : false,
      }
    : {}
  const nextState = {
    ...state,
    ...dimensions,
    ...responsivePickerState,
    ...responsivePickerOpenState,
  }
  if (dimensions.width !== undefined && dimensions.width !== state.width && nextState.composerValue) {
    return {
      ...nextState,
      composerHeight: await getComposerHeightFn(nextState, nextState.composerValue, nextState.width),
    }
  }
  return nextState
}
