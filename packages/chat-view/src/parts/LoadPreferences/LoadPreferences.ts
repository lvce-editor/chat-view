import { loadAiSessionTitleGenerationEnabled } from './LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from './LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from './LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from './LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from './LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from './LoadStreamingEnabled/LoadStreamingEnabled.ts'

export const loadPreferences = async (): Promise<{
  aiSessionTitleGenerationEnabled: boolean
  composerDropActive: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  streamingEnabled: boolean
  passIncludeObfuscation: boolean
}> => {
  const [
    aiSessionTitleGenerationEnabled,
    composerDropActive,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    streamingEnabled,
    passIncludeObfuscation,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadComposerDropActive(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadStreamingEnabled(),
    loadPassIncludeObfuscation(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    composerDropActive,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
  }
}
