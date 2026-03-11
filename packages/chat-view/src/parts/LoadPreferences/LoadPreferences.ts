import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadComposerDropEnabled } from '../LoadComposerDropEnabled/LoadComposerDropEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from '../LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from '../LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from '../LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from '../LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'

export const loadPreferences = async (): Promise<{
  aiSessionTitleGenerationEnabled: boolean
  composerDropEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  streamingEnabled: boolean
  passIncludeObfuscation: boolean
  useChatNetworkWorkerForRequests: boolean
}> => {
  const [
    aiSessionTitleGenerationEnabled,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    streamingEnabled,
    passIncludeObfuscation,
    useChatNetworkWorkerForRequests,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadStreamingEnabled(),
    loadPassIncludeObfuscation(),
    loadUseChatNetworkWorkerForRequests(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
    useChatNetworkWorkerForRequests,
  }
}
