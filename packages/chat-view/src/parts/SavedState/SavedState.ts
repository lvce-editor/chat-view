import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface SavedState {
  readonly chatFocusSidebarWidth: number
  readonly chatListScrollTop: number
  readonly composerValue: string
  readonly lastNormalViewMode: 'list' | 'detail'
  readonly maxToolCalls: number
  readonly messagesScrollTop: number
  readonly nextMessageId: number
  readonly projectExpandedIds: readonly string[]
  readonly projectListScrollTop: number
  readonly projects: readonly { id: string; name: string; uri: string }[]
  readonly renamingSessionId: string
  readonly searchFieldVisible: boolean
  readonly searchValue: string
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly systemPrompt: string
  readonly viewMode: ChatViewMode
}
