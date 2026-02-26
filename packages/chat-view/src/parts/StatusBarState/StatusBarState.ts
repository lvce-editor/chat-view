export interface ChatMessage {
  readonly id: string
  readonly role: 'user' | 'assistant'
  readonly text: string
}

export interface ChatSession {
  readonly id: string
  readonly messages: readonly ChatMessage[]
  readonly title: string
}

export interface StatusBarState {
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
