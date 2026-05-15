import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const canCreatePullRequest = (session: ChatSession | undefined, messages: readonly ChatMessage[] = session?.messages || []): boolean => {
  if (!session?.branchName || !session.workspaceUri || session.pullRequestUrl) {
    return false
  }
  if (getChatSessionStatus(session, messages) !== 'finished') {
    return false
  }
  return messages.some((message) => message.role === 'assistant')
}
