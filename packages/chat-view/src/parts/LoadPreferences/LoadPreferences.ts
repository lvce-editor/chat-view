import { loadAiSessionTitleGenerationEnabled } from './LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from './LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from './LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenApiUseWebSocket } from './LoadOpenApiUseWebSocket/LoadOpenApiUseWebSocket.ts'
import { loadOpenRouterApiKey } from './LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from './LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from './LoadStreamingEnabled/LoadStreamingEnabled.ts'

export const loadPreferences = async (): Promise<{
  aiSessionTitleGenerationEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openApiUseWebSocket: boolean
  openRouterApiKey: string
  streamingEnabled: boolean
  passIncludeObfuscation: boolean
}> => {
  const [
    aiSessionTitleGenerationEnabled,
    openApiApiKey,
    openApiUseWebSocket,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    streamingEnabled,
    passIncludeObfuscation,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadOpenApiApiKey(),
    loadOpenApiUseWebSocket(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadStreamingEnabled(),
    loadPassIncludeObfuscation(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openApiUseWebSocket,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
  }
}
