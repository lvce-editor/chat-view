export interface ChatMessage {
  readonly id: string
  readonly inProgress?: boolean
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly time: string
}
