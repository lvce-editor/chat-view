import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'

const createInProgressAssistantMessage = (messageId: number): ChatMessage => {
  return {
    id: `message-${messageId}`,
    inProgress: true,
    role: 'assistant',
    text: '',
    time: '10:00',
  }
}

const enableInProgress = (
  session: ChatSession,
  nextMessageId: number,
): {
  readonly nextMessageId: number
  readonly session: ChatSession
} => {
  const hasInProgressAssistantMessage = session.messages.some((message) => message.role === 'assistant' && message.inProgress)
  if (hasInProgressAssistantMessage) {
    return {
      nextMessageId,
      session: {
        ...session,
        status: 'in-progress',
      },
    }
  }
  return {
    nextMessageId: nextMessageId + 1,
    session: {
      ...session,
      messages: [...session.messages, createInProgressAssistantMessage(nextMessageId)],
      status: 'in-progress',
    },
  }
}

const disableInProgress = (session: ChatSession): ChatSession => {
  let didChange = false
  const messages: ChatMessage[] = []
  for (const message of session.messages) {
    if (message.role === 'assistant' && message.inProgress) {
      didChange = true
      if (message.text === '') {
        continue
      }
      messages.push({
        ...message,
        inProgress: false,
      })
      continue
    }
    messages.push(message)
  }
  if (!didChange && session.status !== 'in-progress') {
    return session
  }
  return {
    ...session,
    messages,
    status: messages.some((message) => message.role === 'assistant') ? 'finished' : 'idle',
  }
}

export const setInProgress = (state: ChatState, inProgress: boolean): ChatState => {
  if (!state.selectedSessionId) {
    return state
  }
  let nextMessageId = state.nextMessageId
  let didChange = false
  const sessions = state.sessions.map((session) => {
    if (session.id !== state.selectedSessionId) {
      return session
    }
    if (inProgress) {
      const updated = enableInProgress(session, nextMessageId)
      nextMessageId = updated.nextMessageId
      didChange = didChange || updated.session !== session || updated.nextMessageId !== state.nextMessageId
      return updated.session
    }
    const updatedSession = disableInProgress(session)
    didChange = didChange || updatedSession !== session
    return updatedSession
  })
  if (!didChange) {
    return state
  }
  return {
    ...state,
    nextMessageId,
    sessions,
  }
}
