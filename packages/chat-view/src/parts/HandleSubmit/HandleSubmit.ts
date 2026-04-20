/* cspell:words worktrees */

import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import { syncChatStorageChangeListener } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { createBackgroundChatWorktree } from '../CreateBackgroundChatWorktree/CreateBackgroundChatWorktree.ts'
import { executeSlashCommand } from '../ExecuteSlashCommand/ExecuteSlashCommand.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getMentionContextMessage } from '../GetMentionContextMessage/GetMentionContextMessage.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { getOpenApiModelId } from '../GetOpenApiModelId/GetOpenApiModelId.ts'
import { getSlashCommand } from '../GetSlashCommand/GetSlashCommand.ts'
import { getSystemPromptForAgentMode } from '../GetSystemPromptForAgentMode/GetSystemPromptForAgentMode.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'
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

const getProjectUri = (state: ChatState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

const getWorkspaceUri = (state: ChatState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
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
  const effectiveState = state
  const { agentMode, composerValue, nextMessageId, openApiApiKey, selectedModelId, selectedProjectId, selectedSessionId, sessions, viewMode } =
    effectiveState
  const userText = composerValue.trim()
  if (!userText) {
    return effectiveState
  }

  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return executeSlashCommand(effectiveState, slashCommand)
  }

  const assistantMessageId = crypto.randomUUID()

  const workingSessions = sessions
  const { length: workingSessionCount } = workingSessions
  let optimisticState: ChatState
  let composerAttachments = effectiveState.composerAttachments
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    const newSession: ChatSession = {
      id: newSessionId,
      messages: [],
      projectId: selectedProjectId,
      status: 'in-progress',
      title: `Chat ${workingSessionCount + 1}`,
    }
    const provisionedSession = await withProvisionedBackgroundSession(state, newSession)
    await syncChatStorageChangeListener(effectiveState.uid, newSessionId)
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
        parsedMessages: [],
        selectedProjectId: provisionedSession.projectId || state.selectedProjectId,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, provisionedSession],
        viewMode: 'detail',
      }),
    )
    optimisticState = withUpdatedChatInputHistory(optimisticState, userText)
  } else {
    composerAttachments = composerAttachments.length > 0 ? composerAttachments : await getComposerAttachments(effectiveState.selectedSessionId)
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
    const updatedSessionsWithStatus = updateSessionStatus(workingSessionsWithProvisionedSession, selectedSessionId, 'in-progress')
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
        parsedMessages: effectiveState.parsedMessages,
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
  await ChatCoordinatorRequest.handleSubmit({
    attachments: composerAttachments,
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
