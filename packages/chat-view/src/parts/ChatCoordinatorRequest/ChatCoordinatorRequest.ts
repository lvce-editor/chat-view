import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatViewModel } from '../ChatViewModel/ChatViewModel.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export interface HandleSubmitRequestOptions {
  attachments: readonly unknown[]
  id: string
  modelId: string
  openAiKey: string
  requestId: string
  role: 'user' | 'assistant'
  sessionId: string
  systemPrompt: string
  text: string
}

export interface GetAiResponseRequestOptions {
  agentMode?: AgentMode
  assetDir: string
  maxToolCalls?: number
  messageId?: string
  messages: readonly ChatMessage[]
  mockAiResponseDelay?: number
  mockApiCommandId: string
  models: readonly ChatModel[]
  nextMessageId: number
  openApiApiBaseUrl: string
  openApiApiKey: string
  openRouterApiBaseUrl: string
  openRouterApiKey: string
  passIncludeObfuscation?: boolean
  platform: number
  questionToolEnabled?: boolean
  reasoningEffort?: ReasoningEffort
  selectedModelId: string
  streamingEnabled?: boolean
  systemPrompt?: string
  toolEnablement?: ToolEnablement
  useChatNetworkWorkerForRequests?: boolean
  useChatToolWorker?: boolean
  useMockApi: boolean
  userText: string
  webSearchEnabled?: boolean
  workspaceUri?: string
}

export interface GetChatViewModelRequestOptions {
  readonly sessionId: string
  readonly useChatMathWorker?: boolean
}

export const getAiResponse = async (options: Readonly<GetAiResponseRequestOptions>): Promise<ChatMessage> => {
  return ChatCoordinatorWorker.invoke('ChatCoordinator.getAiResponse', options) as Promise<ChatMessage>
}

export const getChatViewModel = async (options: Readonly<GetChatViewModelRequestOptions>): Promise<ChatViewModel> => {
  return ChatCoordinatorWorker.invoke('ChatCoordinator.getChatViewModel', options) as Promise<ChatViewModel>
}

export const handleSubmit = async (options: Readonly<HandleSubmitRequestOptions>): Promise<void> => {
  await ChatCoordinatorWorker.invoke('ChatCoordinator.handleSubmit', options)
}
