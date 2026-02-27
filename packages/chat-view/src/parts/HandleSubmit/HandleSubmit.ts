import type { ChatMessage, ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const getMockAiResponse = (userMessage: string): string => {
  return `Mock AI response: I received "${userMessage}".`
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, nextMessageId, selectedSessionId, sessions } = state
  const userText = composerValue.trim()
  if (!userText) {
    return {
      ...state,
      ignoreNextInput: true,
    }
  }
  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessage: ChatMessage = {
    id: `message-${nextMessageId}`,
    role: 'user',
    text: userText,
    time: userTime,
  }

  await delay(800)

  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const assistantMessage: ChatMessage = {
    id: `message-${nextMessageId + 1}`,
    role: 'assistant',
    text: getMockAiResponse(userText),
    time: assistantTime,
  }

  const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, userMessage, assistantMessage],
    }
  })
  return {
    ...state,
    composerValue: '',
    ignoreNextInput: true,
    inputSource: 'script',
    lastSubmittedSessionId: selectedSessionId,
    nextMessageId: nextMessageId + 2,
    sessions: updatedSessions,
  }
}
