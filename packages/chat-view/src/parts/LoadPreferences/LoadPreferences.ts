import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadAuthEnabled } from '../LoadAuthEnabled/LoadAuthEnabled.ts'
import { loadBackendUrl } from '../LoadBackendUrl/LoadBackendUrl.ts'
import { loadChatHistoryEnabled } from '../LoadChatHistoryEnabled/LoadChatHistoryEnabled.ts'
import { loadComposerDropEnabled } from '../LoadComposerDropEnabled/LoadComposerDropEnabled.ts'
import { loadEmitStreamingFunctionCallEvents } from '../LoadEmitStreamingFunctionCallEvents/LoadEmitStreamingFunctionCallEvents.ts'
import { loadOpenApiApiKey } from '../LoadOpenApiApiKey/LoadOpenApiApiKey.ts'
import { loadOpenRouterApiKey } from '../LoadOpenRouterApiKey/LoadOpenRouterApiKey.ts'
import { loadPassIncludeObfuscation } from '../LoadPassIncludeObfuscation/LoadPassIncludeObfuscation.ts'
import { loadReasoningPickerEnabled } from '../LoadReasoningPickerEnabled/LoadReasoningPickerEnabled.ts'
import { loadScrollDownButtonEnabled } from '../LoadScrollDownButtonEnabled/LoadScrollDownButtonEnabled.ts'
import { loadSearchEnabled } from '../LoadSearchEnabled/LoadSearchEnabled.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadTodoListToolEnabled } from '../LoadTodoListToolEnabled/LoadTodoListToolEnabled.ts'
import { loadToolEnablement } from '../LoadToolEnablement/LoadToolEnablement.ts'
import { loadUseChatCoordinatorWorker } from '../LoadUseChatCoordinatorWorker/LoadUseChatCoordinatorWorker.ts'
import { loadUseChatMathWorker } from '../LoadUseChatMathWorker/LoadUseChatMathWorker.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'
import { loadUseChatToolWorker } from '../LoadUseChatToolWorker/LoadUseChatToolWorker.ts'
import { loadVoiceDictationEnabled } from '../LoadVoiceDictationEnabled/LoadVoiceDictationEnabled.ts'

export interface LoadedPreferences {
  aiSessionTitleGenerationEnabled: boolean
  authEnabled: boolean
  backendUrl: string
  chatHistoryEnabled: boolean
  composerDropEnabled: boolean
  emitStreamingFunctionCallEvents: boolean
  openApiApiKey: string
  openRouterApiKey: string
  passIncludeObfuscation: boolean
  reasoningPickerEnabled: boolean
  scrollDownButtonEnabled: boolean
  searchEnabled: boolean
  streamingEnabled: boolean
  todoListToolEnabled: boolean
  toolEnablement: Record<string, boolean>
  useChatCoordinatorWorker: boolean
  useChatMathWorker: boolean
  useChatNetworkWorkerForRequests: boolean
  useChatToolWorker: boolean
  voiceDictationEnabled: boolean
}

export const loadPreferences = async (): Promise<LoadedPreferences> => {
  const [
    aiSessionTitleGenerationEnabled,
    authEnabled,
    backendUrl,
    chatHistoryEnabled,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    reasoningPickerEnabled,
    scrollDownButtonEnabled,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadAuthEnabled(),
    loadBackendUrl(),
    loadChatHistoryEnabled(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadReasoningPickerEnabled(),
    loadScrollDownButtonEnabled(),
    loadSearchEnabled(),
    loadStreamingEnabled(),
    loadTodoListToolEnabled(),
    loadToolEnablement(),
    loadPassIncludeObfuscation(),
    loadUseChatCoordinatorWorker(),
    loadUseChatMathWorker(),
    loadUseChatNetworkWorkerForRequests(),
    loadUseChatToolWorker(),
    loadVoiceDictationEnabled(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    authEnabled,
    backendUrl,
    chatHistoryEnabled,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    reasoningPickerEnabled,
    scrollDownButtonEnabled,
    searchEnabled,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    voiceDictationEnabled,
  }
}
