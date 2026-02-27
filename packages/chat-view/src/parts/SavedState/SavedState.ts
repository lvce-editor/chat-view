import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'

export interface SavedState {
  readonly composerValue: string
  readonly height: number
  readonly nextMessageId: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly viewMode: ChatViewMode
  readonly width: number
  readonly x: number
  readonly y: number
}
