import * as Preferences from '../Preferences/Preferences.ts'
import { parseToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export interface LoadedPreferences {
  readonly aiSessionTitleGenerationEnabled: boolean
  readonly authEnabled: boolean
  readonly authUseRedirect: boolean
  readonly backendUrl: string
  readonly chatHistoryEnabled: boolean
  readonly composerDropEnabled: boolean
  readonly emitStreamingFunctionCallEvents: boolean
  readonly openApiApiKey: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation: boolean
  readonly reasoningPickerEnabled: boolean
  readonly runModePickerEnabled: boolean
  readonly scrollDownButtonEnabled: boolean
  readonly searchEnabled: boolean
  readonly showChatListTime: boolean
  readonly showModelUsageMultiplier: boolean
  readonly streamingEnabled: boolean
  readonly todoListToolEnabled: boolean
  readonly toolEnablement: Readonly<Record<string, boolean>>
  readonly useAuthWorker: boolean
  readonly useChatCoordinatorWorker: boolean
  readonly useChatMathWorker: boolean
  readonly useChatNetworkWorkerForRequests: boolean
  readonly useChatToolWorker: boolean
  readonly useOwnBackend: boolean
  readonly voiceDictationEnabled: boolean
}

const getBooleanPreference = async (key: string, fallback: boolean): Promise<boolean> => {
  try {
    const value = await Preferences.get(key)
    return typeof value === 'boolean' ? value : fallback
  } catch {
    return fallback
  }
}

const getStringPreference = async (key: string, fallback = ''): Promise<string> => {
  try {
    const value = await Preferences.get(key)
    return typeof value === 'string' ? value : fallback
  } catch {
    return fallback
  }
}

const loadOpenApiApiKey = async (): Promise<string> => {
  const openApiKey = await getStringPreference('secrets.openApiKey')
  if (openApiKey) {
    return openApiKey
  }
  const openApiApiKey = await getStringPreference('secrets.openApiApiKey')
  if (openApiApiKey) {
    return openApiApiKey
  }
  return getStringPreference('secrets.openAiApiKey')
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
    runModePickerEnabled,
    scrollDownButtonEnabled,
    searchEnabled,
    showChatListTime,
    showModelUsageMultiplier,
    streamingEnabled,
    todoListToolEnabled,
    savedToolEnablement,
    passIncludeObfuscation,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useAuthWorker,
    useOwnBackend,
    voiceDictationEnabled,
  ] = await Promise.all([
    getBooleanPreference('chatView.aiSessionTitleGenerationEnabled', false),
    getBooleanPreference('chat.authEnabled', false),
    getBooleanPreference('chat.authUseRedirect', false),
    getStringPreference('chat.backendUrl', ''),
    getBooleanPreference('chat.chatHistoryEnabled', true),
    getBooleanPreference('chatView.composerDropEnabled', true),
    loadOpenApiApiKey(),
    getStringPreference('secrets.openRouterApiKey', ''),
    getBooleanPreference('chatView.emitStreamingFunctionCallEvents', false),
    getBooleanPreference('chatView.reasoningPickerEnabled', false),
    getBooleanPreference('chatView.runModePickerEnabled', true),
    getBooleanPreference('chatView.scrollDownButtonEnabled', false),
    getBooleanPreference('chatView.searchEnabled', false),
    getBooleanPreference('chatView.showChatListTime', true),
    getBooleanPreference('chatView.showModelUsageMultiplier', true),
    getBooleanPreference('chatView.streamingEnabled', true),
    getBooleanPreference('chatView.todoListToolEnabled', false),
    Preferences.get('chat.toolEnablement'),
    getBooleanPreference('chatView.passIncludeObfuscation', false),
    getBooleanPreference('chatView.useChatCoordinatorWorker', true),
    getBooleanPreference('chatView.useChatMathWorker', true),
    getBooleanPreference('chatView.useChatNetworkWorkerForRequests', false),
    getBooleanPreference('chatView.useChatToolWorker', true),
    getBooleanPreference('chatView.useAuthWorker', false),
    getBooleanPreference('chat.useOwnBackend', false),
    getBooleanPreference('chatView.voiceDictationEnabled', false),
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
    runModePickerEnabled,
    scrollDownButtonEnabled,
    searchEnabled,
    showChatListTime,
    showModelUsageMultiplier,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement: parseToolEnablement(savedToolEnablement),
    useAuthWorker,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useOwnBackend,
    voiceDictationEnabled,
  }
}
