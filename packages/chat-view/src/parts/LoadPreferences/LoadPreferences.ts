import { loadAiSessionTitleGenerationEnabled } from './LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from './LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from './LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from './LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from './LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from './LoadStreamingEnabled/LoadStreamingEnabled.ts'

export const loadPreferences = async (): Promise<{
  aiSessionTitleGenerationEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  streamingEnabled: boolean
  passIncludeObfuscation: boolean
}> => {
  const aiSessionTitleGenerationEnabled = await loadAiSessionTitleGenerationEnabled()
  const openApiApiKey = await loadOpenApiApiKey()
  const openRouterApiKey = await loadOpenRouterApiKey()
  const emitStreamingFunctionCallEvents = await loadEmitStreamingFunctionCallEvents()
  const streamingEnabled = await loadStreamingEnabled()
  const passIncludeObfuscation = await loadPassIncludeObfuscation()

  return {
    aiSessionTitleGenerationEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
  }
}
