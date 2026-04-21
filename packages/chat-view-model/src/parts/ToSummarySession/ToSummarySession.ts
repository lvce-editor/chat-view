import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'
import type { ChatSession } from '../ViewModel/ViewModel.ts'

export const toSummarySession = (session: ChatSession): ChatSession => {
  const lastActiveTime = getSessionLastActiveTime({
    ...session,
    messages: session.messages as readonly { readonly time: string }[],
  })
  const summary: ChatSession = {
    ...(session.branchName
      ? {
          branchName: session.branchName,
        }
      : {}),
    id: session.id,
    ...(lastActiveTime
      ? {
          lastActiveTime,
        }
      : {}),
    messages: [],
    ...(session.pullRequestUrl
      ? {
          pullRequestUrl: session.pullRequestUrl,
        }
      : {}),
    title: session.title,
    ...(session.workspaceUri
      ? {
          workspaceUri: session.workspaceUri,
        }
      : {}),
  }
  if (!session.projectId) {
    return summary
  }
  return {
    ...summary,
    projectId: session.projectId,
  }
}