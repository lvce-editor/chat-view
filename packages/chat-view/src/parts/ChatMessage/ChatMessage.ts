export interface ChatMessage {
  readonly id: string
  readonly role: 'user' | 'assistant'
  readonly text: string
  readonly time: string
}
