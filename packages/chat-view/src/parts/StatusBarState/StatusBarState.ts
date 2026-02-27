import type { ChatSession } from '../ChatSession/ChatSession.ts'

export type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
export type { ChatSession } from '../ChatSession/ChatSession.ts'

export interface ChatState {
  readonly assetDir: string
  readonly composerValue: string
  readonly disposed?: boolean
  readonly errorCount: number
  readonly ignoreNextInput: boolean
  readonly initial: boolean
  readonly lastSubmittedSessionId: string
  readonly nextMessageId: number
  readonly nextSessionId: number
  readonly platform: number
  readonly renamingSessionId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly uid: number
  readonly warningCount: number
}
