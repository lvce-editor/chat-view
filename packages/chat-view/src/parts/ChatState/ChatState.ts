import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewFocus } from '../ChatViewFocus/ChatViewFocus.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
export type { ChatModel } from '../ChatModel/ChatModel.ts'
export type { ChatSession } from '../ChatSession/ChatSession.ts'
export type { ChatViewFocus } from '../ChatViewFocus/ChatViewFocus.ts'
export type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface ChatState {
  readonly assetDir: string
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerValue: string
  readonly disposed?: boolean
  readonly errorCount: number
  readonly focus: ChatViewFocus
  readonly focused: boolean
  readonly headerHeight: number
  readonly height: number
  readonly initial: boolean
  readonly inputSource: 'user' | 'script'
  readonly lastSubmittedSessionId: string
  readonly listItemHeight: number
  readonly maxComposerRows: number
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openApiApiKeyInput: string
  readonly openApiApiKeysSettingsUrl: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeysSettingsUrl: string
  readonly openRouterApiKeyState: 'idle' | 'saving'
  readonly platform: number
  readonly renamingSessionId: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly uid: number
  readonly usageOverviewEnabled: boolean
  readonly useMockApi: boolean
  readonly viewMode: ChatViewMode
  readonly warningCount: number
  readonly width: number
  readonly x: number
  readonly y: number
}
