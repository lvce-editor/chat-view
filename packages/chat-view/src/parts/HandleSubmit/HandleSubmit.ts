import type { ChatMessage, ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, nextMessageId, selectedSessionId, sessions } = state
  const text = composerValue.trim()
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      time,
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
    inputSource: 'script',
    lastSubmittedSessionId: selectedSessionId,
    nextMessageId: nextMessageId + 1,
    sessions: updatedSessions,
  }
}
