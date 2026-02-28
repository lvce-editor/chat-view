import type { ChatSession } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly composerValue: string
  readonly height: number
  readonly nextMessageId: number
  readonly renamingSessionId: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly viewMode: ChatViewMode
  readonly width: number
  readonly x: number
  readonly y: number
}
