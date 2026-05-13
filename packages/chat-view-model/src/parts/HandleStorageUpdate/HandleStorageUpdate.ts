import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import { isObject } from '../IsObject/IsObject.ts'
import { getState, setState } from '../ModelState/ModelState.ts'
import { normalizeStoredChatMessage } from '../NormalizeStoredChatMessage/NormalizeStoredChatMessage.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

const handleStorageUpdateListMode = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  // TODO update / requery list
  return state
}

const getMessageFromEvent = (event: unknown): unknown => {
  if (!isObject(event) || typeof event.type !== 'string') {
    return undefined
  }
  if (event.type === 'chat-message-added') {
    return normalizeStoredChatMessage(event.message, {
      fallbackTime: typeof event.timestamp === 'string' ? event.timestamp : undefined,
    })
  }
  if (event.type === 'message') {
    return normalizeStoredChatMessage(event.message, {
      fallbackId: typeof event.requestId === 'string' ? event.requestId : undefined,
      fallbackTime: typeof event.timestamp === 'string' ? event.timestamp : undefined,
    })
  }
  return undefined
}

const toMessages = (events: readonly any[]): readonly any[] => {
  const messages = []
  for (const event of events) {
    const message = getMessageFromEvent(event)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

const getNewSessions = (state: PrototypeStateBase, messages: readonly any[]): readonly any[] => {
  // TODO store messages independent of sessions
  const newSessions = state.sessions.map((session) => {
    if (session.id === state.selectedSessionId) {
      return {
        ...session,
        messages,
      }
    }
    return session
  })
  if (newSessions.length === 0) {
    return [
      {
        id: state.selectedSessionId,
        messages,
      },
    ]
  }
  return newSessions
}

const handleStorageUpdateDetailMode = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  // TODO requery messages
  const { selectedSessionId } = state
  const events = await ChatStorageWorker.invoke('ChatStorage.getMessages', selectedSessionId)
  const messages = toMessages(events)

  const parsedMessages = await parseAndStoreMessagesContent([], messages)
  // TODO store messages independent of sessions
  const newSessions = getNewSessions(state, messages)
  return {
    ...state,
    parsedMessages,
    sessions: newSessions,
  }
}

const getNextState = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  if (state.viewMode === 'detail') {
    return handleStorageUpdateDetailMode(state)
  }
  return handleStorageUpdateListMode(state)
}

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const state = getState(uid)
  if (!state) {
    return
  }
  const nextState = await getNextState(state)
  setState(uid, nextState)
  await RendererWorker.invoke('Chat.rerenderWithQuery', uid)
}
