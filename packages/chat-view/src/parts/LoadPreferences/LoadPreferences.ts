import { loadEmitStreamingFunctionCallEvents } from './LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from './LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from './LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from './LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from './LoadStreamingEnabled/LoadStreamingEnabled.ts'

export const loadPreferences = async (): Promise<{
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  streamingEnabled: boolean
  passIncludeObfuscation: boolean
}> => {
  const [openApiApiKey, openRouterApiKey, emitStreamingFunctionCallEvents, streamingEnabled, passIncludeObfuscation] = await Promise.all([
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadStreamingEnabled(),
    loadPassIncludeObfuscation(),
  ])

  return {
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
  }
}
