import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'

export interface ChatSession {
  readonly branchName?: string
  readonly id: string
  readonly messages: readonly ChatMessage[]
  readonly projectId?: string
  readonly pullRequestUrl?: string
  readonly title: string
  readonly workspaceUri?: string
}
