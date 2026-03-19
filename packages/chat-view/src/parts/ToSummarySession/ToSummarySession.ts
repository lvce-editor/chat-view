import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const toSummarySession = (session: ChatSession): ChatSession => {
  const summary: ChatSession = {
    id: session.id,
    messages: [],
    title: session.title,
  }
  if (!session.projectId) {
    return summary
  }
  return {
    ...summary,
    projectId: session.projectId,
  }
}
