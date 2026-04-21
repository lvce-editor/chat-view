import type { ChatSession } from '../ViewModel/ViewModel.ts'

const getSessionLastActiveTime = (session: ChatSession): string | undefined => {
  if (session.lastActiveTime) {
    return session.lastActiveTime
  }
  const lastMessage = session.messages.at(-1)
  if (!lastMessage || typeof lastMessage !== 'object') {
    return undefined
  }
  const time = Reflect.get(lastMessage, 'time')
  return typeof time === 'string' ? time : undefined
}

export const toSummarySession = (session: ChatSession): ChatSession => {
  const lastActiveTime = getSessionLastActiveTime(session)
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
