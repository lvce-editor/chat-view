import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { copyParsedMessageContent, parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export interface HandleTextChunkState {
  latestState: ChatState
  previousState: ChatState
}

const getToolCallMergeKey = (toolCall: StreamingToolCall): string => {
  if (toolCall.id) {
    return `id:${toolCall.id}`
  }
  return `value:${toolCall.name}:${toolCall.arguments}`
}

const mergeToolCalls = (existing: readonly StreamingToolCall[] = [], incoming: readonly StreamingToolCall[]): readonly StreamingToolCall[] => {
  if (incoming.length === 0) {
    return existing
  }
  const merged = [...existing]
  const indexByKey = new Map<string, number>()
  for (let i = 0; i < merged.length; i++) {
    indexByKey.set(getToolCallMergeKey(merged[i]), i)
  }
  for (const toolCall of incoming) {
    const key = getToolCallMergeKey(toolCall)
    const existingIndex = indexByKey.get(key)
    if (existingIndex === undefined) {
      indexByKey.set(key, merged.length)
      merged.push(toolCall)
      continue
    }
    merged[existingIndex] = toolCall
  }
  return merged
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

export const updateMessageToolCallsInSelectedSession = (
  sessions: readonly ChatSession[],
  parsedMessages: readonly ParsedMessage[],
  selectedSessionId: string,
  messageId: string,
  toolCalls: readonly StreamingToolCall[],
): { readonly parsedMessages: readonly ParsedMessage[]; readonly sessions: readonly ChatSession[] } => {
  let nextParsedMessages = parsedMessages
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
        const updatedMessage = {
          ...message,
          toolCalls: mergeToolCalls(message.toolCalls, toolCalls),
        }
        nextParsedMessages = copyParsedMessageContent(nextParsedMessages, message.id, updatedMessage.id)
        return updatedMessage
      }),
    }
  })
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

export const handleToolCallsChunkFunction = async (
  uid: number,
  assistantMessageId: string,
  toolCalls: readonly StreamingToolCall[],
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
  const updated = updateMessageToolCallsInSelectedSession(
    handleTextChunkState.latestState.sessions,
    handleTextChunkState.latestState.parsedMessages,
    handleTextChunkState.latestState.selectedSessionId,
    assistantMessageId,
    toolCalls,
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
