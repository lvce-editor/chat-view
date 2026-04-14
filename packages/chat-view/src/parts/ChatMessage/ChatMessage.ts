import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'

export type ChatToolCallStatus = 'error' | 'not-found' | 'success'

export interface ChatToolCall {
  readonly arguments: string
  readonly errorMessage?: string
  readonly errorStack?: string
  readonly id?: string
  readonly name: string
  readonly result?: string
  readonly status?: ChatToolCallStatus
}

export interface ChatMessage {
  readonly agentMode?: AgentMode
  readonly attachments?: readonly ComposerAttachment[]
  readonly id: string
  readonly inProgress?: boolean
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly time: string
  readonly toolCalls?: readonly ChatToolCall[]
}
