export interface ChatModel {
  readonly id: string
  readonly name: string
  readonly provider?: 'builtin' | 'test' | 'openRouter' | 'openApi' | 'openAI' | 'openai'
  readonly supportsImages?: boolean
  readonly supportsReasoningEffort?: boolean
  readonly usageCost?: number
}
