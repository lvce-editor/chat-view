import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export interface GetOpenApiAssistantTextOptions {
  readonly agentMode?: AgentMode
  readonly includeObfuscation?: boolean
  readonly maxToolCalls?: number
  readonly onDataEvent?: (value: unknown) => Promise<void>
  readonly onEventStreamFinished?: () => Promise<void>
  readonly onTextChunk?: (chunk: string) => Promise<void>
  readonly onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort?: ReasoningEffort
  readonly sessionId?: string
  readonly stream: boolean
  readonly supportsReasoningEffort?: boolean
  readonly systemPrompt?: string
  readonly toolEnablement?: ToolEnablement
  readonly useChatNetworkWorkerForRequests?: boolean
  readonly useChatToolWorker?: boolean
  readonly webSearchEnabled?: boolean
  readonly workspaceUri?: string
}
