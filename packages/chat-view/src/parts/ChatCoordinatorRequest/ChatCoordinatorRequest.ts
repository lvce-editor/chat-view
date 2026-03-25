import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
export interface GetAiResponseRequestOptions {
  readonly assetDir: string
  readonly maxToolCalls?: number
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
  readonly systemPrompt?: string
  readonly useChatNetworkWorkerForRequests?: boolean
  readonly useChatToolWorker?: boolean
  readonly useMockApi: boolean
  readonly userText: string
  readonly webSearchEnabled?: boolean
  readonly workspaceUri?: string
}

export const getAiResponse = async (options: Readonly<GetAiResponseRequestOptions>): Promise<ChatMessage> => {
  return ChatCoordinatorWorker.invoke('ChatCoordinator.getAiResponse', options) as Promise<ChatMessage>
}
