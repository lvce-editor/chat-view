import { loadAiSessionTitleGenerationEnabled } from '../LoadAiSessionTitleGenerationEnabled/LoadAiSessionTitleGenerationEnabled.ts'
import { loadAuthEnabled } from '../LoadAuthEnabled/LoadAuthEnabled.ts'
import { loadAuthUseRedirect } from '../LoadAuthUseRedirect/LoadAuthUseRedirect.ts'
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
import { loadSessionPinningEnabled } from '../LoadSessionPinningEnabled/LoadSessionPinningEnabled.ts'
import { loadShowChatListTime } from '../LoadShowChatListTime/LoadShowChatListTime.ts'
import { loadStreamingEnabled } from '../LoadStreamingEnabled/LoadStreamingEnabled.ts'
import { loadTodoListToolEnabled } from '../LoadTodoListToolEnabled/LoadTodoListToolEnabled.ts'
import { loadToolEnablement } from '../LoadToolEnablement/LoadToolEnablement.ts'
import { loadUseAuthWorker } from '../LoadUseAuthWorker/LoadUseAuthWorker.ts'
import { loadUseChatCoordinatorWorker } from '../LoadUseChatCoordinatorWorker/LoadUseChatCoordinatorWorker.ts'
import { loadUseChatMathWorker } from '../LoadUseChatMathWorker/LoadUseChatMathWorker.ts'
import { loadUseChatNetworkWorkerForRequests } from '../LoadUseChatNetworkWorkerForRequests/LoadUseChatNetworkWorkerForRequests.ts'
import { loadUseChatToolWorker } from '../LoadUseChatToolWorker/LoadUseChatToolWorker.ts'
import { loadUseOwnBackend } from '../LoadUseOwnBackend/LoadUseOwnBackend.ts'
import { loadVoiceDictationEnabled } from '../LoadVoiceDictationEnabled/LoadVoiceDictationEnabled.ts'

export interface LoadedPreferences {
  aiSessionTitleGenerationEnabled: boolean
  authEnabled: boolean
  authUseRedirect: boolean
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
  sessionPinningEnabled: boolean
  showChatListTime: boolean
  streamingEnabled: boolean
  todoListToolEnabled: boolean
  toolEnablement: Record<string, boolean>
  useAuthWorker: boolean
  useChatCoordinatorWorker: boolean
  useChatMathWorker: boolean
  useChatNetworkWorkerForRequests: boolean
  useChatToolWorker: boolean
  useOwnBackend: boolean
  voiceDictationEnabled: boolean
}

export const loadPreferences = async (): Promise<LoadedPreferences> => {
  const [
    aiSessionTitleGenerationEnabled,
    authEnabled,
    authUseRedirect,
    backendUrl,
    chatHistoryEnabled,
    composerDropEnabled,
    openApiApiKey,
    openRouterApiKey,
    emitStreamingFunctionCallEvents,
    reasoningPickerEnabled,
    scrollDownButtonEnabled,
    searchEnabled,
    sessionPinningEnabled,
    showChatListTime,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useAuthWorker,
    useOwnBackend,
    voiceDictationEnabled,
  ] = await Promise.all([
    loadAiSessionTitleGenerationEnabled(),
    loadAuthEnabled(),
    loadAuthUseRedirect(),
    loadBackendUrl(),
    loadChatHistoryEnabled(),
    loadComposerDropEnabled(),
    loadOpenApiApiKey(),
    loadOpenRouterApiKey(),
    loadEmitStreamingFunctionCallEvents(),
    loadReasoningPickerEnabled(),
    loadScrollDownButtonEnabled(),
    loadSearchEnabled(),
    loadSessionPinningEnabled(),
    loadShowChatListTime(),
    loadStreamingEnabled(),
    loadTodoListToolEnabled(),
    loadToolEnablement(),
    loadPassIncludeObfuscation(),
    loadUseChatCoordinatorWorker(),
    loadUseChatMathWorker(),
    loadUseChatNetworkWorkerForRequests(),
    loadUseChatToolWorker(),
    loadUseAuthWorker(),
    loadUseOwnBackend(),
    loadVoiceDictationEnabled(),
  ])

  return {
    aiSessionTitleGenerationEnabled,
    authEnabled,
    authUseRedirect,
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
    sessionPinningEnabled,
    showChatListTime,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    useAuthWorker,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useOwnBackend,
    voiceDictationEnabled,
  }
}
