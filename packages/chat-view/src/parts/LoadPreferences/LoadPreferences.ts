import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadComposerDropEnabled } from '../LoadComposerDropEnabled/LoadComposerDropEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from '../LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from '../LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from '../LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from '../LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadUseChatCoordinatorWorker } from '../LoadUseChatCoordinatorWorker/LoadUseChatCoordinatorWorker.ts'
import { loadUseChatMathWorker } from '../LoadUseChatMathWorker/LoadUseChatMathWorker.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'
import { loadVoiceDictationEnabled } from '../LoadVoiceDictationEnabled/LoadVoiceDictationEnabled.ts'

export const loadPreferences = async (): Promise<{
  aiSessionTitleGenerationEnabled: boolean
  composerDropEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  passIncludeObfuscation: boolean
  streamingEnabled: boolean
  useChatCoordinatorWorker: boolean
  useChatMathWorker: boolean
  useChatNetworkWorkerForRequests: boolean
  voiceDictationEnabled: boolean
}> => {
  const [
    aiSessionTitleGenerationEnabled,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    streamingEnabled,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    voiceDictationEnabled,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadStreamingEnabled(),
    loadPassIncludeObfuscation(),
    loadUseChatCoordinatorWorker(),
    loadUseChatMathWorker(),
    loadUseChatNetworkWorkerForRequests(),
    loadVoiceDictationEnabled(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    voiceDictationEnabled,
  }
}
