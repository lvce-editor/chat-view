import type { AgentMode } from '../AgentMode/AgentMode.ts'
import { getLoggedOutBackendAuthState, type BackendAuthState, syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { ensureBlankProject } from '../EnsureBlankProject/EnsureBlankProject.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'
import { getSavedAgentMode } from '../GetSavedAgentMode/GetSavedAgentMode.ts'
import { getSavedChatListScrollTop } from '../GetSavedChatListScrollTop/GetSavedChatListScrollTop.ts'
import { getSavedComposerSelection } from '../GetSavedComposerSelection/GetSavedComposerSelection.ts'
import { getSavedComposerValue } from '../GetSavedComposerValue/GetSavedComposerValue.ts'
import { getSavedLastNormalViewMode } from '../GetSavedLastNormalViewMode/GetSavedLastNormalViewMode.ts'
import { getSavedMessagesScrollTop } from '../GetSavedMessagesScrollTop/GetSavedMessagesScrollTop.ts'
import { getSavedProjectExpandedIds } from '../GetSavedProjectExpandedIds/GetSavedProjectExpandedIds.ts'
import { getSavedProjectListScrollTop } from '../GetSavedProjectListScrollTop/GetSavedProjectListScrollTop.ts'
import { getSavedProjectSidebarWidth } from '../GetSavedProjectSidebarWidth/GetSavedProjectSidebarWidth.ts'
import { getSavedProjects } from '../GetSavedProjects/GetSavedProjects.ts'
import { getSavedReasoningEffort } from '../GetSavedReasoningEffort/GetSavedReasoningEffort.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedProjectId } from '../GetSavedSelectedProjectId/GetSavedSelectedProjectId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { loadPreferences, type LoadedPreferences } from '../LoadPreferences/LoadPreferences.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { normalizeSessionsOnLoad } from '../NormalizeSessionsOnLoad/NormalizeSessionsOnLoad.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'
import type {
  ChatModel,
  ChatSession,
  ChatViewMode,
  ComposerAttachment,
  ParsedMessage,
  Project,
  ReasoningEffort,
  ViewModel,
} from '../ViewModel/ViewModel.ts'

export type LastNormalViewMode = Extract<ChatViewMode, 'list' | 'detail'>

export interface LoadContentState extends ViewModel {
  readonly aiSessionTitleGenerationEnabled: boolean
  readonly authAccessToken: string
  readonly authUseRedirect: boolean
  readonly backendUrl: string
  readonly chatHistoryEnabled: boolean
  readonly composerAttachmentsHeight: number
  readonly composerSelectionEnd: number
  readonly composerSelectionStart: number
  readonly emitStreamingFunctionCallEvents: boolean
  readonly initial: boolean
  readonly lastNormalViewMode: LastNormalViewMode
  readonly modelPickerHeaderHeight: number
  readonly modelPickerHeight: number
  readonly modelPickerListScrollTop: number
  readonly openApiApiKey: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation: boolean
  readonly projectSidebarResizing: boolean
  readonly projectSidebarWidth: number
  readonly streamingEnabled: boolean
  readonly toolEnablement: Record<string, boolean>
  readonly useAuthWorker: boolean
  readonly useChatCoordinatorWorker: boolean
  readonly useChatNetworkWorkerForRequests: boolean
  readonly useChatToolWorker: boolean
  readonly useOwnBackend: boolean
  readonly userSubscriptionPlan: string
  readonly userUsedTokens: number
  readonly width: number
}

export interface LoadContentDependencies<TState extends LoadContentState = LoadContentState> {
  readonly ensureBlankProject: (projects: readonly Project[], blankProject: Project) => readonly Project[]
  readonly getComposerAttachments: (selectedSessionId: string) => Promise<readonly ComposerAttachment[]>
  readonly getComposerAttachmentsHeight: (composerAttachments: readonly ComposerAttachment[], width: number) => number
  readonly getLoggedOutBackendAuthState: () => BackendAuthState
  readonly getModelPickerHeight: (modelPickerHeaderHeight: number, visibleModelCount: number) => number
  readonly getSavedAgentMode: (savedState: unknown) => AgentMode | undefined
  readonly getSavedChatListScrollTop: (savedState: unknown) => number | undefined
  readonly getSavedComposerSelection: (savedState: unknown, composerValue: string) => readonly [number, number] | undefined
  readonly getSavedComposerValue: (savedState: unknown) => string | undefined
  readonly getSavedLastNormalViewMode: (savedState: unknown) => LastNormalViewMode | undefined
  readonly getSavedMessagesScrollTop: (savedState: unknown) => number | undefined
  readonly getSavedProjectExpandedIds: (savedState: unknown) => readonly string[] | undefined
  readonly getSavedProjectListScrollTop: (savedState: unknown) => number | undefined
  readonly getSavedProjectSidebarWidth: (savedState: unknown) => number | undefined
  readonly getSavedProjects: (savedState: unknown) => readonly Project[] | undefined
  readonly getSavedReasoningEffort: (savedState: unknown) => ReasoningEffort | undefined
  readonly getSavedSelectedModelId: (savedState: unknown) => string | undefined
  readonly getSavedSelectedProjectId: (savedState: unknown) => string | undefined
  readonly getSavedSelectedSessionId: (savedState: unknown) => string | undefined
  readonly getSavedSessions: (savedState: unknown) => readonly ChatSession[] | undefined
  readonly getSavedViewMode: (savedState: unknown) => ChatViewMode | undefined
  readonly getVisibleModels: (models: readonly ChatModel[], searchValue: string) => readonly ChatModel[]
  readonly getVisibleSessions: (sessions: readonly ChatSession[], selectedProjectId: string) => readonly ChatSession[]
  readonly listChatSessions: () => Promise<readonly ChatSession[]>
  readonly loadPreferences: () => Promise<LoadedPreferences>
  readonly loadSelectedSessionMessages: (sessions: readonly ChatSession[], selectedSessionId: string) => Promise<readonly ChatSession[]>
  readonly normalizeSessionsOnLoad: (sessions: readonly ChatSession[]) => readonly ChatSession[]
  readonly parseAndStoreMessagesContent: (parsedMessages: readonly ParsedMessage[], messages: readonly unknown[]) => Promise<readonly ParsedMessage[]>
  readonly refreshGitBranchPickerVisibility: (state: TState) => Promise<TState>
  readonly saveChatSession: (session: ChatSession) => Promise<void>
  readonly syncBackendAuth: (backendUrl: string) => Promise<BackendAuthState>
  readonly toSummarySession: (session: ChatSession) => ChatSession
}

const getDefaultLoadContentDependencies = <TState extends LoadContentState>(): LoadContentDependencies<TState> => {
  return {
    ensureBlankProject,
    getComposerAttachments,
    getComposerAttachmentsHeight,
    getLoggedOutBackendAuthState,
    getModelPickerHeight,
    getSavedAgentMode,
    getSavedChatListScrollTop,
    getSavedComposerSelection,
    getSavedComposerValue,
    getSavedLastNormalViewMode,
    getSavedMessagesScrollTop,
    getSavedProjectExpandedIds,
    getSavedProjectListScrollTop,
    getSavedProjectSidebarWidth,
    getSavedProjects,
    getSavedReasoningEffort,
    getSavedSelectedModelId,
    getSavedSelectedProjectId,
    getSavedSelectedSessionId,
    getSavedSessions,
    getSavedViewMode,
    getVisibleModels,
    getVisibleSessions,
    listChatSessions,
    loadPreferences,
    loadSelectedSessionMessages,
    normalizeSessionsOnLoad,
    parseAndStoreMessagesContent,
    refreshGitBranchPickerVisibility: async (state: TState) => refreshGitBranchPickerVisibility(state),
    saveChatSession: async (session: ChatSession) => saveChatSession(session as unknown as Parameters<typeof saveChatSession>[0]),
    syncBackendAuth,
    toSummarySession,
  }
}

export const loadContent = async <TState extends LoadContentState>(
  state: TState,
  savedState: unknown,
  {
    ensureBlankProject,
    getComposerAttachments,
    getComposerAttachmentsHeight,
    getLoggedOutBackendAuthState,
    getModelPickerHeight,
    getSavedAgentMode,
    getSavedChatListScrollTop,
    getSavedComposerSelection,
    getSavedComposerValue,
    getSavedLastNormalViewMode,
    getSavedMessagesScrollTop,
    getSavedProjectExpandedIds,
    getSavedProjectListScrollTop,
    getSavedProjectSidebarWidth,
    getSavedProjects,
    getSavedReasoningEffort,
    getSavedSelectedModelId,
    getSavedSelectedProjectId,
    getSavedSelectedSessionId,
    getSavedSessions,
    getSavedViewMode,
    getVisibleModels,
    getVisibleSessions,
    listChatSessions,
    loadPreferences,
    loadSelectedSessionMessages,
    normalizeSessionsOnLoad,
    parseAndStoreMessagesContent,
    refreshGitBranchPickerVisibility,
    saveChatSession,
    syncBackendAuth,
    toSummarySession,
  }: LoadContentDependencies<TState> = getDefaultLoadContentDependencies<TState>(),
): Promise<TState> => {
  const savedSelectedModelId = getSavedSelectedModelId(savedState)
  const savedViewMode = getSavedViewMode(savedState)
  const savedComposerValue = getSavedComposerValue(savedState)
  const composerValue = savedComposerValue ?? state.composerValue
  const savedComposerSelection = getSavedComposerSelection(savedState, composerValue)
  const [composerSelectionStart, composerSelectionEnd] = savedComposerSelection ?? [state.composerSelectionStart, state.composerSelectionEnd]
  const {
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
  } = await loadPreferences()
  const authState =
    authEnabled || useOwnBackend ? (backendUrl ? await syncBackendAuth(backendUrl) : getLoggedOutBackendAuthState()) : getLoggedOutBackendAuthState()
  const legacySavedSessions = getSavedSessions(savedState)
  const storedSessions = await listChatSessions()
  let sessions: readonly ChatSession[] = storedSessions
  if (sessions.length === 0 && legacySavedSessions && legacySavedSessions.length > 0) {
    for (const session of legacySavedSessions) {
      await saveChatSession(session)
    }
    sessions = legacySavedSessions.map(toSummarySession)
  }
  if (sessions.length === 0 && state.sessions.length > 0) {
    for (const session of state.sessions) {
      await saveChatSession(session)
    }
    sessions = state.sessions.map(toSummarySession)
  }
  const preferredSessionId = getSavedSelectedSessionId(savedState) || state.selectedSessionId
  const savedProjects = getSavedProjects(savedState)
  const baseProjects = savedProjects && savedProjects.length > 0 ? savedProjects : state.projects
  const blankProject = state.projects.find((project) => project.name === '_blank') || { id: 'project-blank', name: '_blank', uri: '' }
  const projects = ensureBlankProject(baseProjects, blankProject)
  const preferredProjectId = getSavedSelectedProjectId(savedState) || state.selectedProjectId
  const agentMode = getSavedAgentMode(savedState) ?? state.agentMode
  const selectedProjectId = projects.some((project) => project.id === preferredProjectId) ? preferredProjectId : projects[0]?.id || ''
  const preferredModelId = savedSelectedModelId || state.selectedModelId
  const chatListScrollTop = getSavedChatListScrollTop(savedState) ?? state.chatListScrollTop
  const messagesScrollTop = getSavedMessagesScrollTop(savedState) ?? state.messagesScrollTop
  const projectListScrollTop = getSavedProjectListScrollTop(savedState) ?? state.projectListScrollTop
  const projectSidebarWidth = getSavedProjectSidebarWidth(savedState) ?? state.projectSidebarWidth
  const savedProjectExpandedIds = getSavedProjectExpandedIds(savedState)
  const projectExpandedIds = (savedProjectExpandedIds || state.projectExpandedIds).filter((id) => projects.some((project) => project.id === id))
  const reasoningEffort = getSavedReasoningEffort(savedState) ?? state.reasoningEffort
  const selectedModelId = state.models.some((model) => model.id === preferredModelId) ? preferredModelId : state.models[0]?.id || ''
  const visibleModels = getVisibleModels(state.models, '')
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId)
  const selectedSessionId = visibleSessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : visibleSessions[0]?.id || ''
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  sessions = normalizeSessionsOnLoad(sessions)
  const composerAttachments = await getComposerAttachments(selectedSessionId)
  let { parsedMessages } = state
  for (const session of sessions) {
    parsedMessages = await parseAndStoreMessagesContent(parsedMessages, session.messages)
  }
  const preferredViewMode = savedViewMode || state.viewMode
  const savedLastNormalViewMode = getSavedLastNormalViewMode(savedState)
  const lastNormalViewMode = savedLastNormalViewMode || (preferredViewMode === 'detail' ? 'detail' : state.lastNormalViewMode)
  const viewMode = sessions.length === 0 || !selectedSessionId ? 'list' : preferredViewMode
  const nextState = {
    ...state,
    agentMode,
    agentModePickerOpen: false,
    aiSessionTitleGenerationEnabled,
    authAccessToken: authState.authAccessToken,
    authEnabled,
    authErrorMessage: authState.authErrorMessage,
    authUseRedirect,
    backendUrl,
    chatHistoryEnabled,
    chatListScrollTop,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, state.width),
    composerDropActive: false,
    composerDropEnabled,
    composerSelectionEnd,
    composerSelectionStart,
    composerValue,
    emitStreamingFunctionCallEvents,
    initial: false,
    lastNormalViewMode,
    messagesScrollTop,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, visibleModels.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    openApiApiKey,
    openApiApiKeyInput: openApiApiKey,
    openRouterApiKey,
    openRouterApiKeyInput: openRouterApiKey,
    parsedMessages,
    passIncludeObfuscation,
    projectExpandedIds,
    projectListScrollTop,
    projects,
    projectSidebarResizing: false,
    projectSidebarWidth,
    reasoningEffort,
    reasoningEffortPickerOpen: false,
    reasoningPickerEnabled,
    runModePickerOpen: false,
    scrollDownButtonEnabled,
    searchEnabled,
    searchFieldVisible: false,
    searchValue: '',
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    sessions,
    showChatListTime,
    showRunMode: runModePickerEnabled,
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    useAuthWorker,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useOwnBackend,
    userName: authState.userName,
    userState: authState.userState,
    userSubscriptionPlan: authState.userSubscriptionPlan,
    userUsedTokens: authState.userUsedTokens,
    viewMode,
    visibleModels,
    voiceDictationEnabled,
  } as TState
  return refreshGitBranchPickerVisibility(nextState)
}
