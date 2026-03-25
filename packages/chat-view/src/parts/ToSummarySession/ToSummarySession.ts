import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const toSummarySession = (session: ChatSession): ChatSession => {
  const summary: ChatSession = {
    ...(session.branchName
      ? {
          branchName: session.branchName,
        }
      : {}),
    id: session.id,
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
