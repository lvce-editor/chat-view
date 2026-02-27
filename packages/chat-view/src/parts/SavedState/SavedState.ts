import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly composerValue: string
  readonly nextMessageId: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly viewMode: ChatViewMode
}
