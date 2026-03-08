import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'

export interface GetAiResponseOptions {
  readonly assetDir: string
  readonly messageId?: string
  readonly messages: readonly ChatMessage[]
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly onTextChunk?: (chunk: string) => Promise<void>
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation?: boolean
  readonly platform: number
  readonly selectedModelId: string
  readonly streamingEnabled?: boolean
  readonly useMockApi: boolean
  readonly userText: string
}
