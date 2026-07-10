import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
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
  messages: readonly ChatMessage[],
  parsedMessages: readonly ParsedMessage[],
  messageId: string,
  text: string,
  inProgress: boolean,
): Promise<{ readonly messages: readonly ChatMessage[]; readonly parsedMessages: readonly ParsedMessage[] }> => {
  let updatedMessage: ChatMessage | undefined
  const updatedMessages = messages.map((message) => {
    if (message.id !== messageId) {
      return message
    }
    updatedMessage = {
      ...message,
      inProgress,
      text,
    }
    return updatedMessage
  })
  let nextParsedMessages = parsedMessages
  if (updatedMessage) {
    nextParsedMessages = await parseAndStoreMessageContent(parsedMessages, updatedMessage)
  }
  return {
    messages: updatedMessages,
    parsedMessages: nextParsedMessages,
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
  if (getChatSessionStatus(selectedSession, liveState.messages) === 'stopped') {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const assistantMessage = liveState.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const updatedText = assistantMessage.text + chunk
  const updated = await updateMessageTextInSelectedSession(liveState.messages, liveState.parsedMessages, assistantMessageId, updatedText, true)
  const nextState = {
    ...liveState,
    messages: updated.messages,
    ...(liveState.messagesAutoScrollEnabled && {
      messagesScrollTop: getNextAutoScrollTop(liveState.messagesScrollTop),
    }),
    parsedMessages: updated.parsedMessages,
  }
  set(uid, liveState, nextState)
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
