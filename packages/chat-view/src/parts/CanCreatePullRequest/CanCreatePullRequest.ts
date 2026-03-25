import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const canCreatePullRequest = (session: ChatSession | undefined): boolean => {
  if (!session?.branchName || !session.workspaceUri || session.pullRequestUrl) {
    return false
  }
  const hasInProgressAssistantMessage = session.messages.some((message) => message.role === 'assistant' && message.inProgress)
  if (hasInProgressAssistantMessage) {
    return false
  }
  return session.messages.some((message) => message.role === 'assistant')
}
