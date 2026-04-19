/* cspell:words worktrees */

import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
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
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
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
  const { agentMode, composerValue, nextMessageId, openApiApiKey, selectedModelId, selectedSessionId, sessions, streamingEnabled, viewMode } =
    effectiveState
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
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    const newSession: ChatSession = {
      id: newSessionId,
      messages: streamingEnabled ? [userMessage, inProgressAssistantMessage] : [userMessage],
      projectId: state.selectedProjectId,
      status: 'in-progress',
      title: `Chat ${workingSessions.length + 1}`,
    }
    const provisionedSession = await withProvisionedBackgroundSession(state, newSession)
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
