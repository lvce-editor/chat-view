import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

export interface ChatDebugViewState {
  readonly assetDir: string
  readonly events: readonly ChatViewEvent[]
  readonly filterValue: string
  readonly height: number
  readonly initial: boolean
  readonly platform: number
  readonly sessionId: string
  readonly showInputEvents: boolean
  readonly uid: number
  readonly width: number
  readonly x: number
  readonly y: number
}
