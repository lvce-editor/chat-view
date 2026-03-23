import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'

export interface GetAiResponseRequestOptions {
  readonly assetDir: string
  readonly messageId?: string
  readonly messages: readonly ChatMessage[]
  readonly mockAiResponseDelay?: number
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation?: boolean
  readonly platform: number
  readonly questionToolEnabled?: boolean
  readonly selectedModelId: string
  readonly streamingEnabled?: boolean
  readonly useChatNetworkWorkerForRequests?: boolean
  readonly useChatToolWorker?: boolean
  readonly useMockApi: boolean
  readonly userText: string
  readonly webSearchEnabled?: boolean
}

export const getAiResponse = async (options: Readonly<GetAiResponseRequestOptions>): Promise<ChatMessage> => {
  return ChatCoordinatorWorker.invoke('ChatCoordinator.getAiResponse', options) as Promise<ChatMessage>
}
