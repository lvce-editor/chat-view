import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
export type { ChatSession } from '../ChatSession/ChatSession.ts'
export type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'

export interface ChatState {
  readonly assetDir: string
  readonly composerValue: string
  readonly disposed?: boolean
  readonly errorCount: number
  readonly ignoreNextInput: boolean
  readonly initial: boolean
  readonly inputSource: 'user' | 'script'
  readonly lastSubmittedSessionId: string
  readonly listItemHeight: number
  readonly nextMessageId: number
  readonly platform: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly uid: number
  readonly viewMode: ChatViewMode
  readonly warningCount: number
}
