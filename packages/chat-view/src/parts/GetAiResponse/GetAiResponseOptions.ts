import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'

export interface GetAiResponseOptions {
  readonly assetDir: string
  readonly messages: readonly ChatMessage[]
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly platform: number
  readonly selectedModelId: string
  readonly useMockApi: boolean
  readonly userText: string
}