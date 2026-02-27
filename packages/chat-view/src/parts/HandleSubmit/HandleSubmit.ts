import type { ChatMessage, ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const getMockAiResponse = (userMessage: string): string => {
  return `Mock AI response: I received "${userMessage}".`
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, nextMessageId, selectedSessionId, sessions, viewMode } = state
  const userText = composerValue.trim()
  console.log('submit', userText)
  if (!userText) {
    return state
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

  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    const newSession: ChatSession = {
      id: newSessionId,
      messages: [userMessage, assistantMessage],
      title: `Chat ${sessions.length + 1}`,
    }
    return FocusInput.focusInput({
      ...state,
      composerValue: '',
      inputSource: 'script',
      lastSubmittedSessionId: newSessionId,
      nextMessageId: nextMessageId + 2,
      selectedSessionId: newSessionId,
      sessions: [...sessions, newSession],
      viewMode: 'detail',
    })
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
  return FocusInput.focusInput({
    ...state,
    composerValue: '',
    inputSource: 'script',
    lastSubmittedSessionId: selectedSessionId,
    nextMessageId: nextMessageId + 2,
    sessions: updatedSessions,
  })
}
