import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { canCreatePullRequest } from '../CanCreatePullRequest/CanCreatePullRequest.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { createChatPullRequest } from '../CreateChatPullRequest/CreateChatPullRequest.ts'

export const handleClickCreatePullRequest = async (state: ChatState): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!canCreatePullRequest(selectedSession) || !selectedSession?.branchName || !selectedSession.workspaceUri) {
    return state
  }
  const { pullRequestUrl } = await createChatPullRequest({
    assetDir: state.assetDir,
    branchName: selectedSession.branchName,
    platform: state.platform,
    title: selectedSession.title,
    workspaceUri: selectedSession.workspaceUri,
  })
  const updatedSession = {
    ...selectedSession,
    pullRequestUrl,
  }
  const updatedSessions = state.sessions.map((session) => {
    if (session.id !== selectedSession.id) {
      return session
    }
    return updatedSession
  })
  await saveChatSession(updatedSession)
  await RendererWorker.invoke('Main.openUri', pullRequestUrl)
  return {
    ...state,
    sessions: updatedSessions,
  }
}
