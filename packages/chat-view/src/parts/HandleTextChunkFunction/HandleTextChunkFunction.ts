import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
export { handleToolCallsChunkFunction } from '../HandleToolCallsChunkFunction/HandleToolCallsChunkFunction.ts'
export { updateMessageToolCallsInSelectedSession } from '../UpdateMessageToolCallsInSelectedSession/UpdateMessageToolCallsInSelectedSession.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { get, set } from '../StatusBarStates/StatusBarStates.ts'

export interface HandleTextChunkState {
  latestState: ChatState
  previousState: ChatState
}

export const updateMessageTextInSelectedSession = async (
  sessions: readonly ChatSession[],
  parsedMessages: readonly ParsedMessage[],
  selectedSessionId: string,
  messageId: string,
  text: string,
  inProgress: boolean,
): Promise<{ readonly parsedMessages: readonly ParsedMessage[]; readonly sessions: readonly ChatSession[] }> => {
  let updatedMessage: ChatSession['messages'][number] | undefined
  const updatedSessions = sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: session.messages.map((message) => {
        if (message.id !== messageId) {
          return message
        }
        updatedMessage = {
          ...message,
          inProgress,
          text,
        }
        return updatedMessage
      }),
    }
  })
  let nextParsedMessages = parsedMessages
  if (updatedMessage) {
    nextParsedMessages = await parseAndStoreMessageContent(parsedMessages, updatedMessage)
  }
  return {
    parsedMessages: nextParsedMessages,
    sessions: updatedSessions,
  }
}

export const handleTextChunkFunction = async (
  uid: number,
  sessionId: string,
  assistantMessageId: string,
  chunk: string,
  handleTextChunkState: Readonly<HandleTextChunkState>,
): Promise<HandleTextChunkState> => {
  const liveState = get(uid)?.newState || handleTextChunkState.latestState
  const selectedSession = liveState.sessions.find((session) => session.id === sessionId)
  if (!selectedSession) {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  if (getChatSessionStatus(selectedSession) === 'stopped') {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const updatedText = assistantMessage.text + chunk
  const updated = await updateMessageTextInSelectedSession(
    liveState.sessions,
    liveState.parsedMessages,
    sessionId,
    assistantMessageId,
    updatedText,
    true,
  )
  const nextState = {
    ...liveState,
    ...(liveState.messagesAutoScrollEnabled
      ? {
          messagesScrollTop: getNextAutoScrollTop(liveState.messagesScrollTop),
        }
      : {}),
    parsedMessages: updated.parsedMessages,
    sessions: updated.sessions,
  }
  set(uid, liveState, nextState)
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
