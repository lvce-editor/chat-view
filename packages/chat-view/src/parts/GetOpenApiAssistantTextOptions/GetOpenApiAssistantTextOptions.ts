import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'

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
  readonly stream: boolean
  readonly systemPrompt?: string
  readonly useChatNetworkWorkerForRequests?: boolean
  readonly useChatToolWorker?: boolean
  readonly webSearchEnabled?: boolean
  readonly workspaceUri?: string
}
