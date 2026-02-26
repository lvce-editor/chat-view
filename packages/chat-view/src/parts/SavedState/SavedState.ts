import type { ChatSession } from '../StatusBarState/StatusBarState.ts'

export interface SavedState {
  readonly composerValue: string
  readonly nextMessageId: number
  readonly nextSessionId: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
}
