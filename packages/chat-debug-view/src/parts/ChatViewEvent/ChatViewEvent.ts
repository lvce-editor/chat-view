export interface ChatViewEvent {
  readonly sessionId: string
  readonly timestamp: string
  readonly type: string
  readonly [key: string]: unknown
}
