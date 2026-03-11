import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly chatListScrollTop: number
  readonly composerValue: string
  readonly messagesScrollTop: number
  readonly nextMessageId: number
  readonly projectListScrollTop: number
  readonly projects: readonly { id: string; name: string; uri: string }[]
  readonly renamingSessionId: string
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly viewMode: ChatViewMode
}
