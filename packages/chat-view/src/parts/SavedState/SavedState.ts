import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'

export interface SavedState {
  readonly agentMode: AgentMode
  readonly chatListScrollTop: number
  readonly composerValue: string
  readonly lastNormalViewMode: 'list' | 'detail'
  readonly maxToolCalls: number
  readonly messagesScrollTop: number
  readonly nextMessageId: number
  readonly projectExpandedIds: readonly string[]
  readonly projectListScrollTop: number
  readonly projects: readonly { id: string; name: string; uri: string }[]
  readonly reasoningEffort: ReasoningEffort
  readonly renamingSessionId: string
  readonly searchFieldVisible: boolean
  readonly searchValue: string
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly systemPrompt: string
  readonly viewMode: ChatViewMode
}
