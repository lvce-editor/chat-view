import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { get } from '../StatusBarStates/StatusBarStates.ts'

const submitUpdateRetryDelays = [10, 20, 40, 80, 160, 320]

const wait = async (delay: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, delay))
}

const getSelectedSessionMessageCount = (state: Readonly<ChatState>): number => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  return selectedSession?.messages.length || 0
}

const hasNewerSubmittedState = (state: Readonly<ChatState>, fallbackState: Readonly<ChatState>): boolean => {
  if (getSelectedSessionMessageCount(state) > getSelectedSessionMessageCount(fallbackState)) {
    return true
  }
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  return selectedSession?.status === 'finished' || selectedSession?.status === 'stopped'
}

const waitForLocalSubmitUpdates = async (fallbackState: Readonly<ChatState>): Promise<ChatState> => {
  const currentState = get(fallbackState.uid)?.newState
  if (currentState && hasNewerSubmittedState(currentState, fallbackState)) {
    return currentState
  }
  for (const delay of submitUpdateRetryDelays) {
    await wait(delay)
    const nextState = get(fallbackState.uid)?.newState
    if (nextState && hasNewerSubmittedState(nextState, fallbackState)) {
      return nextState
    }
  }
  return fallbackState
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error) {
    return error
  }
  if (error && typeof error === 'object') {
    const message = Reflect.get(error, 'message')
    if (typeof message === 'string' && message) {
      return message
    }
    const code = Reflect.get(error, 'code')
    if (typeof code === 'string' && code) {
      return code
    }
  }
  return String(error)
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  try {
    const nextState = (await ChatViewModelWorker.invoke('ChatModel.handleSubmit', state)) as ChatState
    return waitForLocalSubmitUpdates(nextState)
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    })
<<<<<<< HEAD
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
        listSelectedSessionId: newSessionId,
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
=======
>>>>>>> main
  }
}
