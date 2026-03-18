import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { copyParsedMessageContent, parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { get, set } from '../StatusBarStates/StatusBarStates.ts'

export interface HandleTextChunkState {
  latestState: ChatState
  previousState: ChatState
  requestSessionId: string
}

const getLatestState = (uid: number, fallbackState: ChatState): ChatState => {
  if (!uid) {
    return fallbackState
  }
  const entry = get(uid)
  return entry?.newState || fallbackState
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
  const currentState = getLatestState(uid, handleTextChunkState.latestState)
  const selectedSession = currentState.sessions.find((session) => session.id === handleTextChunkState.requestSessionId)
  if (!selectedSession) {
    return {
      latestState: currentState,
      previousState: currentState,
      requestSessionId: handleTextChunkState.requestSessionId,
    }
  }
  const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: currentState,
      previousState: currentState,
      requestSessionId: handleTextChunkState.requestSessionId,
    }
  }
  const updatedText = assistantMessage.text + chunk
  const updated = await updateMessageTextInSelectedSession(
    currentState.sessions,
    currentState.parsedMessages,
    handleTextChunkState.requestSessionId,
    assistantMessageId,
    updatedText,
    true,
  )
  const nextState = {
    ...currentState,
    ...(currentState.messagesAutoScrollEnabled && currentState.selectedSessionId === handleTextChunkState.requestSessionId
      ? {
          messagesScrollTop: getNextAutoScrollTop(currentState.messagesScrollTop),
        }
      : {}),
    parsedMessages: updated.parsedMessages,
    sessions: updated.sessions,
  }
  set(uid, currentState, nextState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
    requestSessionId: handleTextChunkState.requestSessionId,
  }
}

export const handleToolCallsChunkFunction = async (
  uid: number,
  assistantMessageId: string,
  toolCalls: readonly StreamingToolCall[],
  handleTextChunkState: Readonly<HandleTextChunkState>,
): Promise<HandleTextChunkState> => {
  const currentState = getLatestState(uid, handleTextChunkState.latestState)
  const selectedSession = currentState.sessions.find((session) => session.id === handleTextChunkState.requestSessionId)
  if (!selectedSession) {
    return {
      latestState: currentState,
      previousState: currentState,
      requestSessionId: handleTextChunkState.requestSessionId,
    }
  }
  const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: currentState,
      previousState: currentState,
      requestSessionId: handleTextChunkState.requestSessionId,
    }
  }
  const updated = updateMessageToolCallsInSelectedSession(
    currentState.sessions,
    currentState.parsedMessages,
    handleTextChunkState.requestSessionId,
    assistantMessageId,
    toolCalls,
  )
  const nextState = {
    ...currentState,
    ...(currentState.messagesAutoScrollEnabled && currentState.selectedSessionId === handleTextChunkState.requestSessionId
      ? {
          messagesScrollTop: getNextAutoScrollTop(currentState.messagesScrollTop),
        }
      : {}),
    parsedMessages: updated.parsedMessages,
    sessions: updated.sessions,
  }
  set(uid, currentState, nextState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
  return {
    latestState: nextState,
    previousState: nextState,
    requestSessionId: handleTextChunkState.requestSessionId,
  }
}
