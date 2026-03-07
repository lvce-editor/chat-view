import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly chatListScrollTop: number
  readonly composerValue: string
  readonly height: number
  readonly messagesScrollTop: number
  readonly nextMessageId: number
  readonly renamingSessionId: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly viewMode: ChatViewMode
  readonly width: number
  readonly x: number
  readonly y: number
}
