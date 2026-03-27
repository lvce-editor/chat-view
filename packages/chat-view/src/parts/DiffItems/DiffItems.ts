import type { ChatState } from '../ChatState/ChatState.ts'
import { isEqualComposerAttachments, isEqualProjectExpandedIds, isEqualVisibleModels } from './IsEqualHelpers/IsEqualHelpers.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.addContextButtonEnabled === newState.addContextButtonEnabled &&
    oldState.agentMode === newState.agentMode &&
    oldState.agentModePickerOpen === newState.agentModePickerOpen &&
    oldState.authEnabled === newState.authEnabled &&
    oldState.authErrorMessage === newState.authErrorMessage &&
    oldState.authStatus === newState.authStatus &&
    isEqualComposerAttachments(oldState.composerAttachments, newState.composerAttachments) &&
    oldState.composerDropActive === newState.composerDropActive &&
    oldState.composerDropEnabled === newState.composerDropEnabled &&
    oldState.composerValue === newState.composerValue &&
    oldState.hasSpaceForAgentModePicker === newState.hasSpaceForAgentModePicker &&
    oldState.hasSpaceForRunModePicker === newState.hasSpaceForRunModePicker &&
    oldState.initial === newState.initial &&
    oldState.modelPickerOpen === newState.modelPickerOpen &&
    oldState.modelPickerSearchValue === newState.modelPickerSearchValue &&
    isEqualVisibleModels(oldState.visibleModels, newState.visibleModels) &&
    oldState.listFocusedIndex === newState.listFocusedIndex &&
    isEqualProjectExpandedIds(oldState.projectExpandedIds, newState.projectExpandedIds) &&
    oldState.projectListScrollTop === newState.projectListScrollTop &&
    oldState.reasoningEffort === newState.reasoningEffort &&
    oldState.reasoningEffortPickerOpen === newState.reasoningEffortPickerOpen &&
    oldState.reasoningPickerEnabled === newState.reasoningPickerEnabled &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedModelId === newState.selectedModelId &&
    oldState.selectedProjectId === newState.selectedProjectId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.showRunMode === newState.showRunMode &&
    oldState.runMode === newState.runMode &&
    oldState.runModePickerOpen === newState.runModePickerOpen &&
    oldState.sessions === newState.sessions &&
    oldState.tokensMax === newState.tokensMax &&
    oldState.tokensUsed === newState.tokensUsed &&
    oldState.usageOverviewEnabled === newState.usageOverviewEnabled &&
    oldState.useChatMathWorker === newState.useChatMathWorker &&
    oldState.viewMode === newState.viewMode &&
    oldState.voiceDictationEnabled === newState.voiceDictationEnabled
  )
}
