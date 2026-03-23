import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadAuthEnabled } from '../LoadAuthEnabled/LoadAuthEnabled.ts'
import { loadBackendAccessToken } from '../LoadBackendAccessToken/LoadBackendAccessToken.ts'
import { loadBackendRefreshToken } from '../LoadBackendRefreshToken/LoadBackendRefreshToken.ts'
import { loadBackendUrl } from '../LoadBackendUrl/LoadBackendUrl.ts'
import { loadComposerDropEnabled } from '../LoadComposerDropEnabled/LoadComposerDropEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from '../LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from '../LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from '../LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from '../LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadSearchEnabled } from '../LoadSearchEnabled/LoadSearchEnabled.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadTodoListToolEnabled } from '../LoadTodoListToolEnabled/LoadTodoListToolEnabled.ts'
import { loadUseChatCoordinatorWorker } from '../LoadUseChatCoordinatorWorker/LoadUseChatCoordinatorWorker.ts'
import { loadUseChatMathWorker } from '../LoadUseChatMathWorker/LoadUseChatMathWorker.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'
import { loadUseChatToolWorker } from '../LoadUseChatToolWorker/LoadUseChatToolWorker.ts'
import { loadVoiceDictationEnabled } from '../LoadVoiceDictationEnabled/LoadVoiceDictationEnabled.ts'

export interface LoadedPreferences {
  aiSessionTitleGenerationEnabled: boolean
  authAccessToken: string
  authEnabled: boolean
  authRefreshToken: string
  backendUrl: string
  composerDropEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  passIncludeObfuscation: boolean
  searchEnabled: boolean
  streamingEnabled: boolean
  todoListToolEnabled: boolean
  useChatCoordinatorWorker: boolean
  useChatMathWorker: boolean
  useChatNetworkWorkerForRequests: boolean
  useChatToolWorker: boolean
  voiceDictationEnabled: boolean
}

export const loadPreferences = async (): Promise<LoadedPreferences> => {
  const [
    aiSessionTitleGenerationEnabled,
    authAccessToken,
    authEnabled,
    authRefreshToken,
    backendUrl,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadBackendAccessToken(),
    loadAuthEnabled(),
    loadBackendRefreshToken(),
    loadBackendUrl(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadSearchEnabled(),
    loadStreamingEnabled(),
    loadTodoListToolEnabled(),
    loadPassIncludeObfuscation(),
    loadUseChatCoordinatorWorker(),
    loadUseChatMathWorker(),
    loadUseChatNetworkWorkerForRequests(),
    loadUseChatToolWorker(),
    loadVoiceDictationEnabled(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    authAccessToken,
    authEnabled,
    authRefreshToken,
    backendUrl,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  }
}
