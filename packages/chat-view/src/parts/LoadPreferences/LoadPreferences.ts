import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadAuthEnabled } from '../LoadAuthEnabled/LoadAuthEnabled.ts'
import { loadBackendAccessToken } from '../LoadBackendAccessToken/LoadBackendAccessToken.ts'
import { loadBackendRefreshToken } from '../LoadBackendRefreshToken/LoadBackendRefreshToken.ts'
import { loadBackendUrl } from '../LoadBackendUrl/LoadBackendUrl.ts'
import { loadChatHistoryEnabled } from '../LoadChatHistoryEnabled/LoadChatHistoryEnabled.ts'
import { loadComposerDropEnabled } from '../LoadComposerDropEnabled/LoadComposerDropEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from '../LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from '../LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from '../LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from '../LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadReasoningPickerEnabled } from '../LoadReasoningPickerEnabled/LoadReasoningPickerEnabled.ts'
import { loadSearchEnabled } from '../LoadSearchEnabled/LoadSearchEnabled.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadTodoListToolEnabled } from '../LoadTodoListToolEnabled/LoadTodoListToolEnabled.ts'
import { loadUseChatCoordinatorWorker } from '../LoadUseChatCoordinatorWorker/LoadUseChatCoordinatorWorker.ts'
import { loadUseChatMathWorker } from '../LoadUseChatMathWorker/LoadUseChatMathWorker.ts'
import { loadUseChatMessageParsingWorker } from '../LoadUseChatMessageParsingWorker/LoadUseChatMessageParsingWorker.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'
import { loadUseChatToolWorker } from '../LoadUseChatToolWorker/LoadUseChatToolWorker.ts'
import { loadVoiceDictationEnabled } from '../LoadVoiceDictationEnabled/LoadVoiceDictationEnabled.ts'

export interface LoadedPreferences {
  aiSessionTitleGenerationEnabled: boolean
  authAccessToken: string
  authEnabled: boolean
  authRefreshToken: string
  backendUrl: string
  chatHistoryEnabled: boolean
  composerDropEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  passIncludeObfuscation: boolean
  reasoningPickerEnabled: boolean
  searchEnabled: boolean
  streamingEnabled: boolean
  todoListToolEnabled: boolean
  useChatCoordinatorWorker: boolean
  useChatMathWorker: boolean
  useChatMessageParsingWorker: boolean
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
    chatHistoryEnabled,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    reasoningPickerEnabled,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatMessageParsingWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadBackendAccessToken(),
    loadAuthEnabled(),
    loadBackendRefreshToken(),
    loadBackendUrl(),
    loadChatHistoryEnabled(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadReasoningPickerEnabled(),
    loadSearchEnabled(),
    loadStreamingEnabled(),
    loadTodoListToolEnabled(),
    loadPassIncludeObfuscation(),
    loadUseChatCoordinatorWorker(),
    loadUseChatMathWorker(),
    loadUseChatMessageParsingWorker(),
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
    chatHistoryEnabled,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    reasoningPickerEnabled,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatMessageParsingWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  }
}
