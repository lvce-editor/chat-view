import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
export { handleToolCallsChunkFunction } from '../HandleToolCallsChunkFunction/HandleToolCallsChunkFunction.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

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
  const updated = await updateMessageTextInSelectedSession(
    handleTextChunkState.latestState.sessions,
    handleTextChunkState.latestState.parsedMessages,
    handleTextChunkState.latestState.selectedSessionId,
    assistantMessageId,
    updatedText,
    true,
  )
  const nextState = {
    ...handleTextChunkState.latestState,
    ...(handleTextChunkState.latestState.messagesAutoScrollEnabled
      ? {
          messagesScrollTop: getNextAutoScrollTop(handleTextChunkState.latestState.messagesScrollTop),
        }
      : {}),
    parsedMessages: updated.parsedMessages,
    sessions: updated.sessions,
  }
  set(uid, handleTextChunkState.previousState, nextState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
