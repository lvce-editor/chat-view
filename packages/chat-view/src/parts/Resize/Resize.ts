import type { ChatState } from '../ChatState/ChatState.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'
import { getResponsivePickerState } from '../GetResponsivePickerState/GetResponsivePickerState.ts'

type GetComposerHeightFn = (state: ChatState, value: string, width: number) => Promise<number>

export const resize = async (state: ChatState, dimensions: any, getComposerHeightFn: GetComposerHeightFn = getComposerHeight): Promise<ChatState> => {
  const { agentModePickerOpen, responsivePickerVisibilityEnabled, runModePickerOpen, width } = state
  const responsivePickerState =
    dimensions.width === undefined ? undefined : getResponsivePickerState(dimensions.width, responsivePickerVisibilityEnabled)
  const responsivePickerOpenState = responsivePickerState
    ? {
        agentModePickerOpen: responsivePickerState.hasSpaceForAgentModePicker ? agentModePickerOpen : false,
        runModePickerOpen: responsivePickerState.hasSpaceForRunModePicker ? runModePickerOpen : false,
      }
    : {}
  const nextState = {
    ...state,
    ...dimensions,
    ...responsivePickerState,
    ...responsivePickerOpenState,
  }
  const { composerAttachments, composerValue, width: nextWidth } = nextState
  if (dimensions.width !== undefined && dimensions.width !== width && composerValue) {
    return {
      ...nextState,
      composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, nextWidth),
      composerHeight: await getComposerHeightFn(nextState, composerValue, nextWidth),
    }
  }
  if (dimensions.width !== undefined && dimensions.width !== width && composerAttachments.length > 0) {
    return {
      ...nextState,
      composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, nextWidth),
    }
  }
  return nextState
}
