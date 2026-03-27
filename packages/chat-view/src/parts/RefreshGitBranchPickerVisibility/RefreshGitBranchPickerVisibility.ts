import type { ChatState } from '../ChatState/ChatState.ts'
import { getGitBranches, hasGitRepository } from '../GetGitBranches/GetGitBranches.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { getWorkspaceUri } from '../GetWorkspaceUri/GetWorkspaceUri.ts'

const withHiddenBranchPicker = (state: ChatState): ChatState => {
  return {
    ...state,
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
  }
}

export const refreshGitBranchPickerVisibility = async (state: ChatState): Promise<ChatState> => {
  if (state.viewMode !== 'chat-focus') {
    return {
      ...state,
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: false,
    }
  }
  const selectedSession = getSelectedSession(state.sessions, state.selectedSessionId)
  const fallbackBranchName = selectedSession?.branchName || ''
  const workspaceUri = getWorkspaceUri(state, selectedSession)
  if (!workspaceUri) {
    return withHiddenBranchPicker(state)
  }
  const visible = await hasGitRepository(workspaceUri)
  if (!visible) {
    if (fallbackBranchName) {
      return {
        ...state,
        gitBranches: [{ current: true, name: fallbackBranchName }],
        gitBranchPickerVisible: true,
      }
    }
    return withHiddenBranchPicker(state)
  }
  try {
    const gitBranches = await getGitBranches(workspaceUri)
    return {
      ...state,
      gitBranches,
      gitBranchPickerVisible: true,
    }
  } catch {
    if (fallbackBranchName) {
      return {
        ...state,
        gitBranches: [{ current: true, name: fallbackBranchName }],
        gitBranchPickerVisible: true,
      }
    }
    return {
      ...state,
      gitBranchPickerVisible: true,
    }
  }
}
