import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
<<<<<<< HEAD
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
    showModelUsageMultiplier,
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
  const authState = await getInitialAuthState(authEnabled, useOwnBackend, backendUrl, useAuthWorker)
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
  const selectedProjectId = projects.some((project: Readonly<{ id: string; name: string; uri: string }>) => project.id === preferredProjectId)
    ? preferredProjectId
    : projects[0]?.id || ''
  const preferredModelId = savedSelectedModelId || state.selectedModelId
  const chatListScrollTop = getSavedChatListScrollTop(savedState) ?? state.chatListScrollTop
  const messagesScrollTop = getSavedMessagesScrollTop(savedState) ?? state.messagesScrollTop
  const projectListScrollTop = getSavedProjectListScrollTop(savedState) ?? state.projectListScrollTop
  const projectSidebarWidth = getSavedProjectSidebarWidth(savedState) ?? state.projectSidebarWidth
  const savedProjectExpandedIds = getSavedProjectExpandedIds(savedState)
  const projectExpandedIds = (savedProjectExpandedIds || state.projectExpandedIds).filter((id) =>
    projects.some((project: Readonly<{ id: string; name: string; uri: string }>) => project.id === id),
  )
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
  const nextState: ChatState = {
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
    listSelectedSessionId: selectedSessionId,
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
    showModelUsageMultiplier,
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
  }
  const refreshedState = await refreshGitBranchPickerVisibility(nextState)
  return updateResponsivePickerState(refreshedState)
=======
  return ChatViewModelWorker.invoke('ChatModel.loadContent', state, savedState) as Promise<ChatState>
>>>>>>> main
}
