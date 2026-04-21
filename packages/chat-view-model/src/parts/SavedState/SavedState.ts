import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatSession, ChatViewMode, Project, ReasoningEffort } from '../ViewModel/ViewModel.ts'

export interface SavedState {
  readonly agentMode?: AgentMode
  readonly chatListScrollTop?: number
  readonly composerSelectionEnd?: number
  readonly composerSelectionStart?: number
  readonly composerValue?: string
  readonly lastNormalViewMode?: 'list' | 'detail'
  readonly messagesScrollTop?: number
  readonly projectExpandedIds?: readonly string[]
  readonly projectListScrollTop?: number
  readonly projects?: readonly Project[]
  readonly projectSidebarWidth?: number
  readonly reasoningEffort?: ReasoningEffort
  readonly selectedModelId?: string
  readonly selectedProjectId?: string
  readonly selectedSessionId?: string
  readonly sessions?: readonly ChatSession[]
  readonly viewMode?: ChatViewMode
}
