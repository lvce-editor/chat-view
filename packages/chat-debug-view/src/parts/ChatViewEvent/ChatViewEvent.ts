export interface ChatViewEvent {
  readonly [key: string]: unknown
  readonly sessionId: string
  readonly timestamp: string
  readonly type: string
}
