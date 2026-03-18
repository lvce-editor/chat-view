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
  readonly id: string
  readonly inProgress?: boolean
  readonly queued?: boolean
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly time: string
  readonly toolCalls?: readonly ChatToolCall[]
}

export interface ChatQueuedMessage extends ChatMessage {
  readonly queued: true
  readonly role: 'user'
  readonly sessionId: string
}
