import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { MockOpenApiRequest } from '../MockOpenApiRequest/MockOpenApiRequest.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export interface GetAiResponseOptions {
  readonly agentMode?: AgentMode
  readonly assetDir: string
  readonly authAccessToken?: string
  readonly authEnabled?: boolean
  readonly backendUrl?: string
  readonly maxToolCalls?: number
  readonly messageId?: string
  readonly messages: readonly ChatMessage[]
  readonly mockAiResponseDelay?: number
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly onDataEvent?: (value: unknown) => Promise<void>
  readonly onEventStreamFinished?: () => Promise<void>
  readonly onMockOpenApiRequestCaptured?: (request: MockOpenApiRequest) => Promise<void> | void
  readonly onTextChunk?: (chunk: string) => Promise<void>
  readonly onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation?: boolean
  readonly platform: number
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort?: ReasoningEffort
  readonly selectedModelId: string
  readonly sessionId?: string
  readonly streamingEnabled?: boolean
  readonly systemPrompt?: string
  readonly toolEnablement?: ToolEnablement
  readonly useChatCoordinatorWorker?: boolean
  readonly useChatNetworkWorkerForRequests?: boolean
  readonly useChatToolWorker?: boolean
  readonly useOwnBackend?: boolean
  readonly useMockApi: boolean
  readonly userText: string
  readonly webSearchEnabled?: boolean
  readonly workspaceUri?: string
}
