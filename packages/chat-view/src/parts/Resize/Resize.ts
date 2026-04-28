import type { ChatState } from '../ChatState/ChatState.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'

type GetComposerHeightFn = (state: ChatState, value: string, width: number) => Promise<number>

export const resize = async (state: ChatState, dimensions: any, getComposerHeightFn: GetComposerHeightFn = getComposerHeight): Promise<ChatState> => {
  const { width } = state
  const mergedState = {
    ...state,
    ...dimensions,
  }
  const nextState = dimensions.width === undefined ? mergedState : applyResponsivePickerState(mergedState)
  const closedNextState =
    dimensions.width === undefined
      ? nextState
      : {
          ...nextState,
          agentModePickerOpen: nextState.hiddenPrimaryControls.includes('agent-mode-picker-toggle') ? false : nextState.agentModePickerOpen,
          modelPickerOpen: nextState.hiddenPrimaryControls.includes('model-picker-toggle') ? false : nextState.modelPickerOpen,
          reasoningEffortPickerOpen: nextState.hiddenPrimaryControls.includes('reasoning-effort-picker-toggle')
            ? false
            : nextState.reasoningEffortPickerOpen,
          runModePickerOpen: nextState.hiddenPrimaryControls.includes('run-mode-picker-toggle') ? false : nextState.runModePickerOpen,
        }
  const { composerAttachments, composerValue, width: nextWidth } = closedNextState
  if (dimensions.width !== undefined && dimensions.width !== width && composerValue) {
    return {
      ...closedNextState,
      composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, nextWidth),
      composerHeight: await getComposerHeightFn(closedNextState, composerValue, nextWidth),
    }
  }
  if (dimensions.width !== undefined && dimensions.width !== width && composerAttachments.length > 0) {
    return {
      ...closedNextState,
      composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, nextWidth),
    }
  }
  return closedNextState
}
