import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly chatListScrollTop: number
  readonly composerValue: string
  readonly messagesScrollTop: number
  readonly nextMessageId: number
  readonly renamingSessionId: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly viewMode: ChatViewMode
}
