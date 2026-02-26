import type { ChatMessage, ChatSession, StatusBarState } from '../StatusBarState/StatusBarState.ts'

const submitRename = (state: StatusBarState): StatusBarState => {
  const { composerValue, renamingSessionId, sessions } = state
  const title = composerValue.trim()
  if (!renamingSessionId || !title) {
    return {
      ...state,
      renamingSessionId: '',
    }
  }
  const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
    if (session.id !== renamingSessionId) {
      return session
    }
    return {
      ...session,
      title,
    }
  })
  return {
    ...state,
    composerValue: '',
    ignoreNextInput: true,
    renamingSessionId: '',
    sessions: updatedSessions,
  }
}

const submitMessage = (state: StatusBarState): StatusBarState => {
  const { composerValue, nextMessageId, selectedSessionId, sessions } = state
  const text = composerValue.trim()
  if (!text) {
    return {
      ...state,
      ignoreNextInput: true,
    }
  }
  const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    const message: ChatMessage = {
      id: `message-${nextMessageId}`,
      role: 'user',
      text,
    }
    return {
      ...session,
      messages: [...session.messages, message],
    }
  })
  return {
    ...state,
    composerValue: '',
    ignoreNextInput: true,
    lastSubmittedSessionId: selectedSessionId,
    nextMessageId: nextMessageId + 1,
    sessions: updatedSessions,
  }
}

export const handleKeyDown = async (state: StatusBarState, key: string, shiftKey: boolean): Promise<StatusBarState> => {
  if (key !== 'Enter' || shiftKey) {
    return state
  }
  if (state.renamingSessionId) {
    return submitRename(state)
  }
  return submitMessage(state)
}
