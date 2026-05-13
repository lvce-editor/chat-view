import type { ChatSession, ChatViewMode, ParsedMessage, Project } from '../ViewModel/ViewModel.ts'

export interface PrototypeStateBase {
  readonly chatInputHistory: readonly string[]
  readonly chatInputHistoryIndex: number
  readonly composerValue: string
  readonly focus: string
  readonly focused: boolean
  readonly lastSubmittedSessionId?: string
  readonly openApiApiKey?: string
  readonly parsedMessages: readonly ParsedMessage[]
  readonly projects: readonly Project[]
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly systemPrompt: string
  readonly uid: number
  readonly viewMode: ChatViewMode
}

export type PrototypeState = PrototypeStateBase & Record<string, unknown>
