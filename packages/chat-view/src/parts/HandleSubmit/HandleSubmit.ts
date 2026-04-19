/* cspell:words worktrees */

import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { appendChatViewEvent, getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import { createBackgroundChatWorktree } from '../CreateBackgroundChatWorktree/CreateBackgroundChatWorktree.ts'
import { executeSlashCommand } from '../ExecuteSlashCommand/ExecuteSlashCommand.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getMentionContextMessage } from '../GetMentionContextMessage/GetMentionContextMessage.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { getSlashCommand } from '../GetSlashCommand/GetSlashCommand.ts'
import { getSystemPromptForAgentMode } from '../GetSystemPromptForAgentMode/GetSystemPromptForAgentMode.ts'
import { getOpenApiModelId } from '../GetOpenApiModelId/GetOpenApiModelId.ts'
import { isDefaultSessionTitle } from '../IsDefaultSessionTitle/IsDefaultSessionTitle.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { get, set } from '../StatusBarStates/StatusBarStates.ts'
import { withUpdatedChatInputHistory } from '../WithUpdatedChatInputHistory/WithUpdatedChatInputHistory.ts'

const withUpdatedMessageScrollTop = (state: ChatState): ChatState => {
  if (!state.messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
  }
}

const getLiveState = (uid: number): ChatState | undefined => {
  const entry = get(uid)
  return entry?.newState
}

const updateSessionStatus = (
  sessions: readonly ChatSession[],
  sessionId: string,
  status: NonNullable<ChatSession['status']>,
): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== sessionId) {
      return session
    }
    return {
      ...session,
      status,
    }
  })
}

const isSessionStopped = (uid: number, sessionId: string): boolean => {
  const liveState = getLiveState(uid)
  if (!liveState) {
    return false
  }
  const session = liveState.sessions.find((item) => item.id === sessionId)
  if (!session) {
    return false
  }
  return getChatSessionStatus(session) === 'stopped'
}

const clearComposerAttachments = async (sessionId: string, attachmentIds: readonly string[]): Promise<void> => {
  if (!sessionId) {
    return
  }
  for (const attachmentId of attachmentIds) {
    await appendChatViewEvent({
      attachmentId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-removed',
    })
  }
}

const getProjectUri = (state: ChatState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

const getWorkspaceUri = (state: ChatState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
}

const resolveWorkspaceUri = async (state: ChatState, session: ChatSession | undefined): Promise<string> => {
  const workspaceUri = getWorkspaceUri(state, session)
  if (workspaceUri) {
    return workspaceUri
  }
  try {
    return await RendererWorker.getWorkspacePath()
  } catch {
    return ''
  }
}

const withProvisionedBackgroundSession = async (state: ChatState, session: ChatSession): Promise<ChatSession> => {
  if (state.runMode !== 'background' || session.workspaceUri) {
    return session
  }
  const { branchName, workspaceUri } = await createBackgroundChatWorktree({
    assetDir: state.assetDir,
    platform: state.platform,
    projectUri: getProjectUri(state, session.projectId || state.selectedProjectId),
    sessionId: session.id,
    title: session.title,
  })
  return {
    ...session,
    branchName,
    workspaceUri,
  }
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const shouldSyncBackendAuth = (state.authEnabled || state.useOwnBackend) && !!state.backendUrl
  const authState = shouldSyncBackendAuth ? await syncBackendAuth(state.backendUrl) : undefined
  const effectiveState = authState
    ? {
        ...state,
        ...authState,
      }
    : state
  const {
    agentMode,
    aiSessionTitleGenerationEnabled,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    composerValue,
    emitStreamingFunctionCallEvents,
    maxToolCalls,
    mockAiResponseDelay,
    mockApiCommandId,
    models,
    nextMessageId,
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    passIncludeObfuscation,
    platform,
    questionToolEnabled,
    reasoningEffort,
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    toolEnablement,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    useOwnBackend,
    viewMode,
    webSearchEnabled,
  } = effectiveState
  const userText = composerValue.trim()
  if (!userText) {
    return effectiveState
  }

  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return executeSlashCommand(effectiveState, slashCommand)
  }

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessageId = crypto.randomUUID()
  const composerAttachments =
    effectiveState.composerAttachments.length > 0
      ? effectiveState.composerAttachments
      : await getComposerAttachments(effectiveState.selectedSessionId)
  await clearComposerAttachments(
    effectiveState.selectedSessionId,
    composerAttachments.map((attachment) => attachment.attachmentId),
  )
  const userMessage: ChatMessage = {
    ...(composerAttachments.length > 0
      ? {
          attachments: composerAttachments,
        }
      : {}),
    id: userMessageId,
    role: 'user',
    text: userText,
    time: userTime,
  }
  const assistantMessageId = crypto.randomUUID()
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const inProgressAssistantMessage: ChatMessage = {
    ...(agentMode === 'plan'
      ? {
          agentMode,
        }
      : {}),
    id: assistantMessageId,
    inProgress: true,
    role: 'assistant',
    text: '',
    time: assistantTime,
  }
  let { parsedMessages } = effectiveState
  parsedMessages = await parseAndStoreMessageContent(parsedMessages, userMessage)
  parsedMessages = await parseAndStoreMessageContent(parsedMessages, inProgressAssistantMessage)

  let workingSessions = sessions
  if (viewMode === 'detail') {
    const loadedSession = await getChatSession(selectedSessionId)
    if (loadedSession) {
      workingSessions = sessions.map((session) => {
        if (session.id !== selectedSessionId) {
          return session
        }
        return loadedSession
      })
    }
  }

  let optimisticState: ChatState
  const createsNewSession = viewMode === 'list'
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    await appendChatViewEvent({
      sessionId: newSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const newSession: ChatSession = {
      id: newSessionId,
      messages: streamingEnabled ? [userMessage, inProgressAssistantMessage] : [userMessage],
      projectId: state.selectedProjectId,
      status: 'in-progress',
      title: `Chat ${workingSessions.length + 1}`,
    }
    const provisionedSession = await withProvisionedBackgroundSession(state, newSession)
    await saveChatSession(provisionedSession)
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: newSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        selectedProjectId: provisionedSession.projectId || state.selectedProjectId,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, provisionedSession],
        viewMode: 'detail',
      }),
    )
    optimisticState = withUpdatedChatInputHistory(optimisticState, userText)
  } else {
    await appendChatViewEvent({
      sessionId: selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const loadedSelectedSession = workingSessions.find((session) => session.id === selectedSessionId)
    const provisionedSelectedSession = loadedSelectedSession ? await withProvisionedBackgroundSession(state, loadedSelectedSession) : undefined
    const workingSessionsWithProvisionedSession = provisionedSelectedSession
      ? workingSessions.map((session) => {
          if (session.id !== selectedSessionId) {
            return session
          }
          return provisionedSelectedSession
        })
      : workingSessions
    const updatedWithUser = appendMessageToSelectedSession(workingSessionsWithProvisionedSession, selectedSessionId, userMessage)
    const updatedSessions = streamingEnabled
      ? appendMessageToSelectedSession(updatedWithUser, selectedSessionId, inProgressAssistantMessage)
      : updatedWithUser
    const updatedSessionsWithStatus = updateSessionStatus(updatedSessions, selectedSessionId, 'in-progress')
    const selectedSession = updatedSessionsWithStatus.find((session) => session.id === selectedSessionId)
    if (selectedSession) {
      await saveChatSession(selectedSession)
    }
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: selectedSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        sessions: updatedSessionsWithStatus,
      }),
    )
    optimisticState = withUpdatedChatInputHistory(optimisticState, userText)
  }

  set(effectiveState.uid, effectiveState, optimisticState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')

  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === optimisticState.selectedSessionId)
  const systemPrompt = getSystemPromptForAgentMode(
    optimisticState.systemPrompt,
    getWorkspaceUri(optimisticState, selectedOptimisticSession),
    agentMode,
  )
  const mentionContextMessage = await getMentionContextMessage(userText)
  const attachments = composerAttachments
  await ChatCoordinatorRequest.handleSubmit({
    attachments,
    id: assistantMessageId,
    modelId: getOpenApiModelId(selectedModelId),
    openAiKey: openApiApiKey,
    requestId: assistantMessageId,
    role: 'user',
    sessionId: optimisticState.selectedSessionId,
    systemPrompt,
    text: mentionContextMessage ? `${userText}\n\n${mentionContextMessage.text}` : userText,
  })
  console.warn('ChatCoordinator.handleSubmit completed')
  return optimisticState
}
