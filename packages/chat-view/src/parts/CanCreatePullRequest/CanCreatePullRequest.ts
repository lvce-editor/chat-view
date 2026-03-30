import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const canCreatePullRequest = (session: ChatSession | undefined): boolean => {
  if (!session?.branchName || !session.workspaceUri || session.pullRequestUrl) {
    return false
  }
  if (getChatSessionStatus(session) !== 'finished') {
    return false
  }
  return session.messages.some((message) => message.role === 'assistant')
}
