export interface ChatToolCall {
  readonly arguments: string
  readonly id?: string
  readonly name: string
}

export interface ChatMessage {
  readonly id: string
  readonly inProgress?: boolean
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly time: string
  readonly toolCalls?: readonly ChatToolCall[]
}
