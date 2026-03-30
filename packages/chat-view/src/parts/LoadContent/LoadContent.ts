import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getLoggedOutBackendAuthState, syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
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
import { getSavedProjects } from '../GetSavedProjects/GetSavedProjects.ts'
import { getSavedProjectSidebarWidth } from '../GetSavedProjectSidebarWidth/GetSavedProjectSidebarWidth.ts'
import { getSavedReasoningEffort } from '../GetSavedReasoningEffort/GetSavedReasoningEffort.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedProjectId } from '../GetSavedSelectedProjectId/GetSavedSelectedProjectId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { loadPreferences } from '../LoadPreferences/LoadPreferences.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const savedSelectedModelId = getSavedSelectedModelId(savedState)
  const savedViewMode = getSavedViewMode(savedState)
  const savedComposerValue = getSavedComposerValue(savedState)
  const composerValue = savedComposerValue ?? state.composerValue
  const savedComposerSelection = getSavedComposerSelection(savedState, composerValue)
  const [composerSelectionStart, composerSelectionEnd] = savedComposerSelection ?? [state.composerSelectionStart, state.composerSelectionEnd]
  const {
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
  } = await loadPreferences()
  const authState = authEnabled && backendUrl ? await syncBackendAuth(backendUrl) : getLoggedOutBackendAuthState()
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
    streamingEnabled,
    todoListToolEnabled,
    toolEnablement,
    useChatCoordinatorWorker,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    userName: authState.userName,
    userState: authState.userState,
    userSubscriptionPlan: authState.userSubscriptionPlan,
    userUsedTokens: authState.userUsedTokens,
    viewMode,
    visibleModels,
    voiceDictationEnabled,
  }
  return refreshGitBranchPickerVisibility(nextState)
}
