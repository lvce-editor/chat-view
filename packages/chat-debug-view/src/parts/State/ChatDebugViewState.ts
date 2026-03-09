import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

export interface ChatDebugViewState {
  readonly assetDir: string
  readonly databaseName: string
  readonly dataBaseVersion: number
  readonly errorMessage: string
  readonly events: readonly ChatViewEvent[]
  readonly eventStoreName: string
  readonly filterValue: string
  readonly height: number
  readonly initial: boolean
  readonly platform: number
  readonly sessionId: string
  readonly sessionIdIndexName: string
  readonly showEventStreamFinishedEvents: boolean
  readonly showInputEvents: boolean
  readonly showResponsePartEvents: boolean
  readonly uid: number
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}
