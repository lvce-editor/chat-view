import type { ChatState } from '../ChatState/ChatState.ts'
import { getGitBranches } from '../GetGitBranches/GetGitBranches.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { getWorkspaceUri } from '../GetWorkspaceUri/GetWorkspaceUri.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

const getBranchPickerErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Failed to load git branches.'
}

export const openGitBranchPicker = async (state: ChatState): Promise<ChatState> => {
  const visibleState = await refreshGitBranchPickerVisibility(state)
  const selectedSession = getSelectedSession(visibleState.sessions, visibleState.selectedSessionId)
  const fallbackBranchName = selectedSession?.branchName || ''
  if (visibleState.viewMode !== 'chat-focus' || (!visibleState.gitBranchPickerVisible && !fallbackBranchName)) {
    return {
      ...visibleState,
      gitBranchPickerOpen: false,
    }
  }
  const workspaceUri = getWorkspaceUri(visibleState, selectedSession)
  if (!workspaceUri) {
    return {
      ...visibleState,
      gitBranches: [],
      gitBranchPickerErrorMessage: 'No workspace is selected.',
      gitBranchPickerOpen: true,
    }
  }
  try {
    const gitBranches = await getGitBranches(workspaceUri)
    return {
      ...visibleState,
      agentModePickerOpen: false,
      gitBranches,
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: true,
      modelPickerOpen: false,
      modelPickerSearchValue: '',
      reasoningEffortPickerOpen: false,
      runModePickerOpen: false,
      visibleModels: visibleState.models,
    }
  } catch (error) {
    return {
      ...visibleState,
      agentModePickerOpen: false,
      gitBranches: fallbackBranchName ? [{ current: true, name: fallbackBranchName }] : [],
      gitBranchPickerErrorMessage: getBranchPickerErrorMessage(error),
      gitBranchPickerOpen: true,
      modelPickerOpen: false,
      modelPickerSearchValue: '',
      reasoningEffortPickerOpen: false,
      runModePickerOpen: false,
      visibleModels: visibleState.models,
    }
  }
}
