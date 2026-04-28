import type { ChatState } from '../ChatState/ChatState.ts'
import {
  isEqualComposerAttachments,
  isEqualGitBranches,
  isEqualProjectExpandedIds,
  isEqualProjects,
  isEqualVisibleModels,
} from './IsEqualHelpers/IsEqualHelpers.ts'

const isEqualPrimaryControls = (oldItems: readonly string[], newItems: readonly string[]): boolean => {
  if (oldItems.length !== newItems.length) {
    return false
  }
  for (let i = 0; i < oldItems.length; i++) {
    if (oldItems[i] !== newItems[i]) {
      return false
    }
  }
  return true
}

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.addContextButtonEnabled === newState.addContextButtonEnabled &&
    oldState.agentMode === newState.agentMode &&
    oldState.agentModePickerOpen === newState.agentModePickerOpen &&
    oldState.authEnabled === newState.authEnabled &&
    oldState.authErrorMessage === newState.authErrorMessage &&
    isEqualComposerAttachments(oldState.composerAttachments, newState.composerAttachments) &&
    oldState.composerDropActive === newState.composerDropActive &&
    oldState.composerDropEnabled === newState.composerDropEnabled &&
    oldState.composerValue === newState.composerValue &&
    oldState.gitBranchPickerErrorMessage === newState.gitBranchPickerErrorMessage &&
    oldState.gitBranchPickerOpen === newState.gitBranchPickerOpen &&
    oldState.gitBranchPickerVisible === newState.gitBranchPickerVisible &&
    isEqualGitBranches(oldState.gitBranches, newState.gitBranches) &&
    oldState.hasSpaceForAgentModePicker === newState.hasSpaceForAgentModePicker &&
    oldState.hasSpaceForRunModePicker === newState.hasSpaceForRunModePicker &&
    isEqualPrimaryControls(oldState.hiddenPrimaryControls, newState.hiddenPrimaryControls) &&
    oldState.initial === newState.initial &&
    oldState.listFocusOutline === newState.listFocusOutline &&
    oldState.modelPickerOpen === newState.modelPickerOpen &&
    oldState.modelPickerSearchValue === newState.modelPickerSearchValue &&
    isEqualVisibleModels(oldState.visibleModels, newState.visibleModels) &&
    oldState.listFocusedIndex === newState.listFocusedIndex &&
    oldState.openApiApiKeyInput === newState.openApiApiKeyInput &&
    oldState.openRouterApiKeyInput === newState.openRouterApiKeyInput &&
    oldState.primaryControlsOverflowButtonVisible === newState.primaryControlsOverflowButtonVisible &&
    isEqualProjectExpandedIds(oldState.projectExpandedIds, newState.projectExpandedIds) &&
    isEqualProjects(oldState.projects, newState.projects) &&
    oldState.reasoningEffort === newState.reasoningEffort &&
    oldState.reasoningEffortPickerOpen === newState.reasoningEffortPickerOpen &&
    oldState.reasoningPickerEnabled === newState.reasoningPickerEnabled &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedModelId === newState.selectedModelId &&
    oldState.selectedProjectId === newState.selectedProjectId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.searchEnabled === newState.searchEnabled &&
    oldState.searchFieldVisible === newState.searchFieldVisible &&
    oldState.searchValue === newState.searchValue &&
    oldState.showChatListTime === newState.showChatListTime &&
    oldState.showModelUsageMultiplier === newState.showModelUsageMultiplier &&
    oldState.showRunMode === newState.showRunMode &&
    oldState.runMode === newState.runMode &&
    oldState.runModePickerOpen === newState.runModePickerOpen &&
    oldState.sessions === newState.sessions &&
    oldState.selectChevronEnabled === newState.selectChevronEnabled &&
    oldState.tokensMax === newState.tokensMax &&
    oldState.tokensUsed === newState.tokensUsed &&
    oldState.usageOverviewEnabled === newState.usageOverviewEnabled &&
    oldState.useChatMathWorker === newState.useChatMathWorker &&
    oldState.userName === newState.userName &&
    oldState.userState === newState.userState &&
    oldState.viewMode === newState.viewMode &&
    isEqualPrimaryControls(oldState.visiblePrimaryControls, newState.visiblePrimaryControls) &&
    oldState.voiceDictationEnabled === newState.voiceDictationEnabled
  )
}
