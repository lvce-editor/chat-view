/* cspell:ignore sonarjs worktree worktrees */

import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatModel, ChatViewMode, ParsedMessage, Project, ReasoningEffort, RunMode } from '../ViewModel/ViewModel.ts'

export interface AuthStatePatch {
  readonly authAccessToken?: string
}

export interface HandleSubmitState {
  readonly agentMode: AgentMode
  readonly aiSessionTitleGenerationEnabled: boolean
  readonly assetDir: string
  readonly authAccessToken: string
  readonly authEnabled: boolean
  readonly backendUrl: string
  readonly chatInputHistory: readonly string[]
  readonly chatInputHistoryIndex: number
  readonly composerAttachments: readonly {
    readonly attachmentId: string
    readonly displayType: 'file' | 'image' | 'invalid-image' | 'text-file'
    readonly mimeType: string
    readonly name: string
    readonly previewSrc?: string
    readonly size: number
    readonly textContent?: string
  }[]
  readonly composerAttachmentsHeight: number
  readonly composerHeight: number
  readonly composerSelectionEnd: number
  readonly composerSelectionStart: number
  readonly composerValue: string
  readonly emitStreamingFunctionCallEvents: boolean
  readonly focus: 'header' | 'list' | 'composer' | 'input' | 'send-button' | 'model-picker-input' | 'picker-list'
  readonly focused: boolean
  readonly inputSource: 'user' | 'script'
  readonly lastSubmittedSessionId: string
  readonly maxToolCalls: number
  readonly messagesAutoScrollEnabled: boolean
  readonly messagesScrollTop: number
  readonly mockAiResponseDelay: number
  readonly mockApiCommandId: string
  readonly mockOpenApiRequests: readonly unknown[]
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly parsedMessages: readonly ParsedMessage[]
  readonly passIncludeObfuscation: boolean
  readonly platform: number
  readonly projects: readonly Project[]
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort: ReasoningEffort
  readonly runMode: RunMode
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly streamingEnabled: boolean
  readonly systemPrompt: string
  readonly toolEnablement: Readonly<Record<string, boolean>>
  readonly uid: number
  readonly useChatCoordinatorWorker: boolean
  readonly useChatNetworkWorkerForRequests: boolean
  readonly useChatToolWorker: boolean
  readonly useMockApi: boolean
  readonly useOwnBackend: boolean
  readonly viewMode: ChatViewMode
  readonly webSearchEnabled: boolean
}

export interface HandleTextChunkState<TState extends HandleSubmitState = HandleSubmitState> {
  readonly latestState: TState
  readonly previousState: TState
}

export interface UpdateMessageTextResult {
  readonly parsedMessages: readonly ParsedMessage[]
  readonly sessions: readonly ChatSession[]
}

export interface CreateBackgroundChatWorktreeOptions {
  readonly assetDir: string
  readonly platform: number
  readonly projectUri: string
  readonly sessionId: string
  readonly title: string
}

export interface GetAiResponseOptions {
  readonly agentMode: AgentMode
  readonly assetDir: string
  readonly authAccessToken: string
  readonly authEnabled: boolean
  readonly backendUrl: string
  readonly maxToolCalls: number
  readonly messageId: string
  readonly messages: readonly ChatMessage[]
  readonly mockAiResponseDelay: number
  readonly mockApiCommandId: string
  readonly models: readonly ChatModel[]
  readonly nextMessageId: number
  readonly onDataEvent: (value: unknown) => Promise<void>
  readonly onEventStreamFinished: () => Promise<void>
  readonly onMockOpenApiRequestCaptured: (request: unknown) => Promise<void>
  readonly onTextChunk?: (chunk: string) => Promise<void>
  readonly onToolCallsChunk: (toolCalls: readonly unknown[]) => Promise<void>
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly passIncludeObfuscation: boolean
  readonly platform: number
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort: ReasoningEffort
  readonly selectedModelId: string
  readonly sessionId: string
  readonly streamingEnabled: boolean
  readonly systemPrompt: string
  readonly toolEnablement: Readonly<Record<string, boolean>>
  readonly useChatCoordinatorWorker: boolean
  readonly useChatNetworkWorkerForRequests: boolean
  readonly useChatToolWorker: boolean
  readonly useMockApi: boolean
  readonly useOwnBackend: boolean
  readonly userText: string
  readonly webSearchEnabled: boolean
  readonly workspaceUri: string
}

export interface HandleSubmitDependencies<TState extends HandleSubmitState = HandleSubmitState> {
  readonly appendChatViewEvent: (event: {
    readonly attachmentId?: string
    readonly sessionId: string
    readonly timestamp: string
    readonly type: 'chat-attachment-removed' | 'event-stream-finished' | 'handle-submit' | 'sse-response-completed' | 'sse-response-part'
    readonly value?: unknown
  }) => Promise<void>
  readonly appendMessageToSelectedSession: (sessions: readonly ChatSession[], sessionId: string, message: ChatMessage) => readonly ChatSession[]
  readonly createBackgroundChatWorktree: (
    options: CreateBackgroundChatWorktreeOptions,
  ) => Promise<{ readonly branchName: string; readonly workspaceUri: string }>
  readonly executeSlashCommand: (state: TState, slashCommand: unknown) => Promise<TState>
  readonly focusInput: (state: TState) => TState
  readonly generateSessionId: () => string
  readonly getAiResponse: (options: GetAiResponseOptions) => Promise<ChatMessage>
  readonly getAiSessionTitle: (state: TState, userText: string, assistantText: string) => Promise<string>
  readonly getChatSession: (sessionId: string) => Promise<ChatSession | undefined>
  readonly getChatSessionStatus: (session: ChatSession) => NonNullable<ChatSession['status']>
  readonly getComposerAttachments: (sessionId: string) => Promise<HandleSubmitState['composerAttachments']>
  readonly getMentionContextMessage: (userText: string) => Promise<ChatMessage | undefined>
  readonly getMinComposerHeightForState: (state: TState) => number
  readonly getNextAutoScrollTop: (messagesScrollTop: number) => number
  readonly getSlashCommand: (userText: string) => unknown
  readonly getSseEventType: (value: unknown) => 'sse-response-completed' | 'sse-response-part'
  readonly getStatusBarState: (uid: number) => { readonly newState: TState } | undefined
  readonly getSystemPromptForAgentMode: (systemPrompt: string, workspaceUri: string, agentMode: AgentMode) => string
  readonly getWorkspacePath: () => Promise<string>
  readonly handleTextChunkFunction: (
    uid: number,
    sessionId: string,
    messageId: string,
    chunk: string,
    state: HandleTextChunkState<TState>,
  ) => Promise<HandleTextChunkState<TState>>
  readonly handleToolCallsChunkFunction: (
    uid: number,
    sessionId: string,
    messageId: string,
    toolCalls: readonly unknown[],
    state: HandleTextChunkState<TState>,
  ) => Promise<HandleTextChunkState<TState>>
  readonly isDefaultSessionTitle: (title: string) => boolean
  readonly isStreamingFunctionCallEvent: (value: unknown) => boolean
  readonly parseAndStoreMessageContent: (parsedMessages: readonly ParsedMessage[], message: ChatMessage) => Promise<readonly ParsedMessage[]>
  readonly rerender: () => Promise<void>
  readonly saveChatSession: (session: ChatSession) => Promise<void>
  readonly setStatusBarState: (uid: number, oldState: TState, newState: TState) => void
  readonly syncBackendAuth: (backendUrl: string) => Promise<AuthStatePatch | undefined>
  readonly updateMessageTextInSelectedSession: (
    sessions: readonly ChatSession[],
    parsedMessages: readonly ParsedMessage[],
    sessionId: string,
    messageId: string,
    text: string,
    inProgress: boolean,
  ) => Promise<UpdateMessageTextResult>
  readonly updateSessionTitle: (sessions: readonly ChatSession[], sessionId: string, title: string) => readonly ChatSession[]
  readonly withUpdatedChatInputHistory: (state: TState, userText: string) => TState
}

const withUpdatedMessageScrollTop = <TState extends HandleSubmitState>(
  state: TState,
  getNextAutoScrollTop: HandleSubmitDependencies<TState>['getNextAutoScrollTop'],
): TState => {
  if (!state.messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
  }
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

const clearComposerAttachments = async <TState extends HandleSubmitState>(
  sessionId: string,
  attachmentIds: readonly string[],
  dependencies: Pick<HandleSubmitDependencies<TState>, 'appendChatViewEvent'>,
): Promise<void> => {
  if (!sessionId) {
    return
  }
  for (const attachmentId of attachmentIds) {
    await dependencies.appendChatViewEvent({
      attachmentId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-removed',
    })
  }
}

const getProjectUri = (state: HandleSubmitState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

const getWorkspaceUri = (state: HandleSubmitState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
}

const resolveWorkspaceUri = async <TState extends HandleSubmitState>(
  state: TState,
  session: ChatSession | undefined,
  dependencies: Pick<HandleSubmitDependencies<TState>, 'getWorkspacePath'>,
): Promise<string> => {
  const workspaceUri = getWorkspaceUri(state, session)
  if (workspaceUri) {
    return workspaceUri
  }
  try {
    return await dependencies.getWorkspacePath()
  } catch {
    return ''
  }
}

const withProvisionedBackgroundSession = async <TState extends HandleSubmitState>(
  state: TState,
  session: ChatSession,
  dependencies: Pick<HandleSubmitDependencies<TState>, 'createBackgroundChatWorktree'>,
): Promise<ChatSession> => {
  if (state.runMode !== 'background' || session.workspaceUri) {
    return session
  }
  const { branchName, workspaceUri } = await dependencies.createBackgroundChatWorktree({
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

const getLiveState = <TState extends HandleSubmitState>(
  uid: number,
  dependencies: Pick<HandleSubmitDependencies<TState>, 'getStatusBarState'>,
): TState | undefined => {
  const entry = dependencies.getStatusBarState(uid)
  return entry?.newState
}

const isSessionStopped = <TState extends HandleSubmitState>(
  uid: number,
  sessionId: string,
  dependencies: Pick<HandleSubmitDependencies<TState>, 'getChatSessionStatus' | 'getStatusBarState'>,
): boolean => {
  const liveState = getLiveState(uid, dependencies)
  if (!liveState) {
    return false
  }
  const session = liveState.sessions.find((item) => item.id === sessionId)
  if (!session) {
    return false
  }
  return dependencies.getChatSessionStatus(session) === 'stopped'
}

export const handleSubmit = async <TState extends HandleSubmitState>(
  state: TState,
  dependencies: HandleSubmitDependencies<TState>,
): Promise<TState> => {
  console.log('beforee submit', state.composerValue)
  const shouldSyncBackendAuth = (state.authEnabled || state.useOwnBackend) && !!state.backendUrl
  const authState = shouldSyncBackendAuth ? await dependencies.syncBackendAuth(state.backendUrl) : undefined
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
    selectedProjectId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    toolEnablement,
    uid,
    useChatCoordinatorWorker,
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

  const slashCommand = dependencies.getSlashCommand(userText)
  if (slashCommand) {
    return dependencies.executeSlashCommand(effectiveState, slashCommand)
  }

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessageId = crypto.randomUUID()
  const composerAttachments =
    effectiveState.composerAttachments.length > 0
      ? effectiveState.composerAttachments
      : await dependencies.getComposerAttachments(effectiveState.selectedSessionId)
  await clearComposerAttachments(
    effectiveState.selectedSessionId,
    composerAttachments.map((attachment) => attachment.attachmentId),
    dependencies,
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
  parsedMessages = await dependencies.parseAndStoreMessageContent(parsedMessages, userMessage)
  parsedMessages = await dependencies.parseAndStoreMessageContent(parsedMessages, inProgressAssistantMessage)

  let workingSessions = sessions
  if (viewMode === 'detail') {
    const loadedSession = await dependencies.getChatSession(selectedSessionId)
    if (loadedSession) {
      workingSessions = sessions.map((session) => {
        if (session.id !== selectedSessionId) {
          return session
        }
        return loadedSession
      })
    }
  }

  let optimisticState: TState
  const createsNewSession = viewMode === 'list'
  if (viewMode === 'list') {
    const newSessionId = dependencies.generateSessionId()
    await dependencies.appendChatViewEvent({
      sessionId: newSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const newSession: ChatSession = {
      id: newSessionId,
      messages: streamingEnabled ? [userMessage, inProgressAssistantMessage] : [userMessage],
      projectId: selectedProjectId,
      status: 'in-progress',
      title: `Chat ${workingSessions.length + 1}`,
    }
    const provisionedSession = await withProvisionedBackgroundSession(state, newSession, dependencies)
    await dependencies.saveChatSession(provisionedSession)
    optimisticState = withUpdatedMessageScrollTop(
      dependencies.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: dependencies.getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: newSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        selectedProjectId: provisionedSession.projectId || selectedProjectId,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, provisionedSession],
        viewMode: 'detail',
      }),
      dependencies.getNextAutoScrollTop,
    )
    optimisticState = dependencies.withUpdatedChatInputHistory(optimisticState, userText)
  } else {
    await dependencies.appendChatViewEvent({
      sessionId: selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const loadedSelectedSession = workingSessions.find((session) => session.id === selectedSessionId)
    const provisionedSelectedSession = loadedSelectedSession
      ? await withProvisionedBackgroundSession(state, loadedSelectedSession, dependencies)
      : undefined
    const workingSessionsWithProvisionedSession = provisionedSelectedSession
      ? workingSessions.map((session) => {
          if (session.id !== selectedSessionId) {
            return session
          }
          return provisionedSelectedSession
        })
      : workingSessions
    const updatedWithUser = dependencies.appendMessageToSelectedSession(workingSessionsWithProvisionedSession, selectedSessionId, userMessage)
    const updatedSessions = streamingEnabled
      ? dependencies.appendMessageToSelectedSession(updatedWithUser, selectedSessionId, inProgressAssistantMessage)
      : updatedWithUser
    const updatedSessionsWithStatus = updateSessionStatus(updatedSessions, selectedSessionId, 'in-progress')
    const selectedSession = updatedSessionsWithStatus.find((session) => session.id === selectedSessionId)
    if (selectedSession) {
      await dependencies.saveChatSession(selectedSession)
    }
    optimisticState = withUpdatedMessageScrollTop(
      dependencies.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: dependencies.getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: selectedSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        sessions: updatedSessionsWithStatus,
      }),
      dependencies.getNextAutoScrollTop,
    )
    optimisticState = dependencies.withUpdatedChatInputHistory(optimisticState, userText)
  }

  dependencies.setStatusBarState(uid, effectiveState, optimisticState)
  await dependencies.rerender()

  let handleTextChunkState: HandleTextChunkState<TState> = {
    latestState: optimisticState,
    previousState: optimisticState,
  }
  let { mockOpenApiRequests } = optimisticState
  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === optimisticState.selectedSessionId)
  const workspaceUri = useMockApi
    ? getWorkspaceUri(optimisticState, selectedOptimisticSession)
    : await resolveWorkspaceUri(optimisticState, selectedOptimisticSession, dependencies)
  const systemPrompt = dependencies.getSystemPromptForAgentMode(optimisticState.systemPrompt, workspaceUri, agentMode)
  const messages = (selectedOptimisticSession?.messages ?? []).filter((message) => !message.inProgress)
  const mentionContextMessage = await dependencies.getMentionContextMessage(userText)
  const messagesWithMentionContext = mentionContextMessage ? [...messages, mentionContextMessage] : messages

  const handleTextChunkFunctionRef = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        handleTextChunkState = await dependencies.handleTextChunkFunction(
          uid,
          optimisticState.selectedSessionId,
          assistantMessageId,
          chunk,
          handleTextChunkState,
        )
      }
    : undefined

  const assistantMessageResponse = await dependencies.getAiResponse({
    agentMode,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    maxToolCalls,
    messageId: assistantMessageId,
    messages: messagesWithMentionContext,
    mockAiResponseDelay,
    mockApiCommandId,
    models,
    nextMessageId: optimisticState.nextMessageId,
    onDataEvent: async (value: unknown): Promise<void> => {
      if (isSessionStopped(uid, optimisticState.selectedSessionId, dependencies)) {
        return
      }
      if (!emitStreamingFunctionCallEvents && dependencies.isStreamingFunctionCallEvent(value)) {
        return
      }
      const sseEventType = dependencies.getSseEventType(value)
      await dependencies.appendChatViewEvent({
        sessionId: optimisticState.selectedSessionId,
        timestamp: new Date().toISOString(),
        type: sseEventType,
        value,
      })
    },
    onEventStreamFinished: async (): Promise<void> => {
      if (isSessionStopped(uid, optimisticState.selectedSessionId, dependencies)) {
        return
      }
      await dependencies.appendChatViewEvent({
        sessionId: optimisticState.selectedSessionId,
        timestamp: new Date().toISOString(),
        type: 'event-stream-finished',
        value: '[DONE]',
      })
    },
    onMockOpenApiRequestCaptured: async (request: unknown): Promise<void> => {
      mockOpenApiRequests = [...mockOpenApiRequests, request]
    },
    ...(handleTextChunkFunctionRef
      ? {
          onTextChunk: handleTextChunkFunctionRef,
        }
      : {}),
    onToolCallsChunk: async (toolCalls: readonly unknown[]): Promise<void> => {
      handleTextChunkState = await dependencies.handleToolCallsChunkFunction(
        uid,
        optimisticState.selectedSessionId,
        assistantMessageId,
        toolCalls,
        handleTextChunkState,
      )
    },
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    passIncludeObfuscation,
    platform,
    ...(typeof questionToolEnabled === 'boolean'
      ? {
          questionToolEnabled,
        }
      : {}),
    reasoningEffort,
    selectedModelId,
    sessionId: optimisticState.selectedSessionId,
    streamingEnabled,
    systemPrompt,
    toolEnablement,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    useOwnBackend,
    userText,
    webSearchEnabled,
    workspaceUri,
  })
  const assistantMessage: ChatMessage =
    agentMode === 'plan'
      ? {
          ...assistantMessageResponse,
          agentMode,
        }
      : assistantMessageResponse

  if (isSessionStopped(uid, optimisticState.selectedSessionId, dependencies)) {
    return getLiveState(uid, dependencies) || handleTextChunkState.latestState
  }

  const { latestState } = handleTextChunkState
  let finalParsedMessages = latestState.parsedMessages
  let updatedSessions: readonly ChatSession[]
  if (streamingEnabled) {
    const updated = await dependencies.updateMessageTextInSelectedSession(
      latestState.sessions,
      finalParsedMessages,
      latestState.selectedSessionId,
      assistantMessageId,
      assistantMessage.text,
      false,
    )
    updatedSessions = updated.sessions
    finalParsedMessages = updated.parsedMessages
  } else {
    finalParsedMessages = await dependencies.parseAndStoreMessageContent(finalParsedMessages, assistantMessage)
    updatedSessions = dependencies.appendMessageToSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessage)
  }
  if (aiSessionTitleGenerationEnabled && createsNewSession) {
    const selectedSession = updatedSessions.find((session) => session.id === latestState.selectedSessionId)
    if (selectedSession && dependencies.isDefaultSessionTitle(selectedSession.title)) {
      const generatedTitle = await dependencies.getAiSessionTitle(latestState, userText, assistantMessage.text)
      if (generatedTitle) {
        updatedSessions = dependencies.updateSessionTitle(updatedSessions, latestState.selectedSessionId, generatedTitle)
      }
    }
  }
  updatedSessions = updateSessionStatus(updatedSessions, latestState.selectedSessionId, 'finished')
  const selectedSession = updatedSessions.find((session) => session.id === latestState.selectedSessionId)
  if (selectedSession) {
    await dependencies.saveChatSession(selectedSession)
  }

  return withUpdatedMessageScrollTop(
    dependencies.focusInput({
      ...latestState,
      mockOpenApiRequests,
      nextMessageId: latestState.nextMessageId + 1,
      parsedMessages: finalParsedMessages,
      sessions: updatedSessions,
    }),
    dependencies.getNextAutoScrollTop,
  )
}
