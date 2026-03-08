import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export interface HandleTextChunkState {
  latestState: ChatState
  previousState: ChatState
}

export const updateMessageTextInSelectedSession = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  messageId: string,
  text: string,
  inProgress: boolean,
): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: session.messages.map((message) => {
        if (message.id !== messageId) {
          return message
        }
        return {
          ...message,
          inProgress,
          text,
        }
      }),
    }
  })
}

export const handleTextChunkFunction = async (
  uid: number,
  assistantMessageId: string,
  chunk: string,
  handleTextChunkState: Readonly<HandleTextChunkState>,
): Promise<HandleTextChunkState> => {
  const selectedSession = handleTextChunkState.latestState.sessions.find(
    (session) => session.id === handleTextChunkState.latestState.selectedSessionId,
  )
  if (!selectedSession) {
    return {
      latestState: handleTextChunkState.latestState,
      previousState: handleTextChunkState.previousState,
    }
  }
  const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: handleTextChunkState.latestState,
      previousState: handleTextChunkState.previousState,
    }
  }
  const updatedText = assistantMessage.text + chunk
  const updatedSessions = updateMessageTextInSelectedSession(
    handleTextChunkState.latestState.sessions,
    handleTextChunkState.latestState.selectedSessionId,
    assistantMessageId,
    updatedText,
    true,
  )
  const nextState = {
    ...handleTextChunkState.latestState,
    sessions: updatedSessions,
  }
  set(uid, handleTextChunkState.previousState, nextState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
