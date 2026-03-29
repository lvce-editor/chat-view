import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { getWorkspaceUri } from '../GetWorkspaceUri/GetWorkspaceUri.ts'
import { switchGitBranch } from '../SwitchGitBranch/SwitchGitBranch.ts'

const getGitBranchSwitchErrorMessage = (branchName: string, error: unknown): string => {
  if (error instanceof Error && error.message) {
    return `Failed to switch to branch "${branchName}". ${error.message}`
  }
  return `Failed to switch to branch "${branchName}".`
}

export const handleGitBranchChange = async (state: ChatState, branchName: string): Promise<ChatState> => {
  if (!branchName) {
    return state
  }
  const selectedSession = getSelectedSession(state.sessions, state.selectedSessionId)
  const workspaceUri = getWorkspaceUri(state, selectedSession)
  if (!workspaceUri) {
    return {
      ...state,
      gitBranchPickerErrorMessage: 'No workspace is selected.',
      gitBranchPickerOpen: true,
    }
  }
  try {
    await switchGitBranch({
      assetDir: state.assetDir,
      branchName,
      platform: state.platform,
      workspaceUri,
    })
    const updatedSessions = state.sessions.map((session) => {
      if (session.id !== state.selectedSessionId) {
        return session
      }
      return {
        ...session,
        branchName,
      }
    })
    const updatedSelectedSession = updatedSessions.find((session) => session.id === state.selectedSessionId)
    if (updatedSelectedSession) {
      await saveChatSession(updatedSelectedSession)
    }
    return {
      ...state,
      gitBranches: state.gitBranches.map((branch) => ({
        ...branch,
        current: branch.name === branchName,
      })),
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: false,
      sessions: updatedSessions,
    }
  } catch (error) {
    return {
      ...state,
      gitBranchPickerErrorMessage: getGitBranchSwitchErrorMessage(branchName, error),
      gitBranchPickerOpen: true,
    }
  }
}
