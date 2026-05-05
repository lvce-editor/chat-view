import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'

export type AuthUserState = 'loggedIn' | 'loggingIn' | 'loggedOut' | 'loggingOut'

export interface ChatModel {
  readonly id: string
  readonly name: string
  readonly provider?: 'test' | 'openRouter' | 'openApi' | 'openAI' | 'openai'
  readonly supportsImages?: boolean
  readonly supportsReasoningEffort?: boolean
  readonly usageCost?: number
}

export type ChatViewMode = 'list' | 'detail' | 'chat-focus'

export interface GitBranch {
  readonly current: boolean
  readonly name: string
}

export interface ParsedMessage {
  readonly id: string
  readonly parsedContent: readonly unknown[]
  readonly text: string
}

export interface Project {
  readonly id: string
  readonly name: string
  readonly uri: string
}

export type ReasoningEffort = 'extra-high' | 'high' | 'medium' | 'low'

export type RunMode = 'local' | 'background' | 'cloud'

export type ApiKeyState = 'idle' | 'saving'

export interface ViewModel {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerOpen: boolean
  readonly authEnabled: boolean
  readonly authErrorMessage: string
  readonly chatListScrollTop: number
  readonly composerAttachmentPreviewOverlayAttachmentId: string
  readonly composerAttachmentPreviewOverlayError: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerDropActive: boolean
  readonly composerDropEnabled: boolean
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerValue: string
  readonly gitBranches: readonly GitBranch[]
  readonly gitBranchPickerErrorMessage: string
  readonly gitBranchPickerOpen: boolean
  readonly gitBranchPickerVisible: boolean
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
  readonly listFocusedIndex: number
  readonly listFocusOutline: boolean
  readonly messagesAutoScrollEnabled: boolean
  readonly messagesScrollTop: number
  readonly modelPickerOpen: boolean
  readonly modelPickerSearchValue: string
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openApiApiKeyInputPattern: string
  readonly openApiApiKeysSettingsUrl: string
  readonly openApiApiKeyState: ApiKeyState
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState: ApiKeyState
  readonly parsedMessages: readonly ParsedMessage[]
  readonly projectExpandedIds: readonly string[]
  readonly projectListScrollTop: number
  readonly projects: readonly Project[]
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen: boolean
  readonly reasoningPickerEnabled: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen: boolean
  readonly scrollDownButtonEnabled: boolean
  readonly searchEnabled: boolean
  readonly searchFieldVisible: boolean
  readonly searchValue: string
  readonly selectChevronEnabled: boolean
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showChatListTime: boolean
  readonly showModelUsageMultiplier: boolean
  readonly showRunMode: boolean
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker: boolean
  readonly useModelWorker: boolean
  readonly userName: string
  readonly userState: AuthUserState
  readonly viewMode: ChatViewMode
  readonly visibleModels: readonly ChatModel[]
  readonly voiceDictationEnabled: boolean
}

export type { ChatSession } from '../ChatSession/ChatSession.ts'
export type { ComposerAttachment, ComposerAttachmentDisplayType } from '../ComposerAttachment/ComposerAttachment.ts'
