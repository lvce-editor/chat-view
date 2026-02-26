import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'

export interface SavedState {
  readonly composerValue: string
  readonly itemsLeft: readonly StatusBarItem[]
  readonly itemsRight: readonly StatusBarItem[]
  readonly nextMessageId: number
  readonly nextSessionId: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
}
