import { beforeEach } from '@jest/globals'
import { ChatStorageWorker as RpcChatStorageWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../src/parts/ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../src/parts/ChatSession/ChatSession.ts'
import type { ChatViewEvent } from '../src/parts/ChatViewEvent/ChatViewEvent.ts'
import * as ChatStorageWorker from '../src/parts/ChatStorageWorker/ChatStorageWorker.ts'

interface StorageState {
  readonly eventsBySessionId: Map<string, ChatViewEvent[]>
  readonly sessionsById: Map<string, ChatSession>
}

const createStorageState = (): StorageState => {
  return {
    eventsBySessionId: new Map<string, ChatViewEvent[]>(),
    sessionsById: new Map<string, ChatSession>(),
  }
}

let storageState = createStorageState()

const cloneMessage = (message: ChatMessage): ChatMessage => {
  return message.toolCalls
    ? {
        ...message,
        toolCalls: [...message.toolCalls],
      }
    : {
        ...message,
      }
}

const cloneSession = (session: ChatSession): ChatSession => {
  return {
    ...session,
    messages: session.messages.map(cloneMessage),
  }
}

const appendSessionCreatedEvent = (session: ChatSession): void => {
  const events = storageState.eventsBySessionId.get(session.id) || []
  const hasSessionCreatedEvent = events.some((event) => event.type === 'chat-session-created')
  if (hasSessionCreatedEvent) {
    return
  }
  const createdEvent: ChatViewEvent = {
    sessionId: session.id,
    timestamp: new Date().toISOString(),
    title: session.title,
    type: 'chat-session-created',
  }
  storageState.eventsBySessionId.set(session.id, [...events, createdEvent])
}

const appendMessageEvents = (session: ChatSession, previousSession: ChatSession | undefined): void => {
  const events = storageState.eventsBySessionId.get(session.id) || []
  const previousMessagesById = new Map(previousSession?.messages.map((message) => [message.id, message]))
  const nextEvents: ChatViewEvent[] = []
  for (const message of session.messages) {
    const previousMessage = previousMessagesById.get(message.id)
    if (!previousMessage) {
      nextEvents.push({
        message: cloneMessage(message),
        sessionId: session.id,
        timestamp: new Date().toISOString(),
        type: 'chat-message-added',
      })
      continue
    }
    if (
      previousMessage.text !== message.text ||
      previousMessage.inProgress !== message.inProgress ||
      previousMessage.toolCalls !== message.toolCalls
    ) {
      nextEvents.push({
        inProgress: message.inProgress,
        messageId: message.id,
        sessionId: session.id,
        text: message.text,
        time: message.time,
        timestamp: new Date().toISOString(),
        toolCalls: message.toolCalls ? [...message.toolCalls] : undefined,
        type: 'chat-message-updated',
      })
    }
  }
  if (nextEvents.length === 0) {
    return
  }
  storageState.eventsBySessionId.set(session.id, [...events, ...nextEvents])
}

beforeEach(() => {
  using mockRpc = RpcChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent': async (event: ChatViewEvent): Promise<void> => {
      const existingEvents = storageState.eventsBySessionId.get(event.sessionId) || []
      storageState.eventsBySessionId.set(event.sessionId, [...existingEvents, event])
    },
    'ChatStorage.clear': async (): Promise<void> => {
      storageState = createStorageState()
    },
    'ChatStorage.deleteSession': async (sessionId: string): Promise<void> => {
      storageState.sessionsById.delete(sessionId)
      const existingEvents = storageState.eventsBySessionId.get(sessionId) || []
      storageState.eventsBySessionId.set(sessionId, [
        ...existingEvents,
        {
          sessionId,
          timestamp: new Date().toISOString(),
          type: 'chat-session-deleted',
        },
      ])
    },
    'ChatStorage.getEvents': async (sessionId?: string): Promise<readonly ChatViewEvent[]> => {
      if (sessionId) {
        return storageState.eventsBySessionId.get(sessionId) || []
      }
      return [...storageState.eventsBySessionId.values()].flat()
    },
    'ChatStorage.getSession': async (sessionId: string): Promise<ChatSession | undefined> => {
      const session = storageState.sessionsById.get(sessionId)
      return session ? cloneSession(session) : undefined
    },
    'ChatStorage.listSessions': async (): Promise<readonly ChatSession[]> => {
      return Array.from(storageState.sessionsById.values(), cloneSession)
    },
    'ChatStorage.setSession': async (session: ChatSession): Promise<void> => {
      const previousSession = storageState.sessionsById.get(session.id)
      const nextSession = cloneSession(session)
      storageState.sessionsById.set(session.id, nextSession)
      appendSessionCreatedEvent(nextSession)
      appendMessageEvents(nextSession, previousSession)
    },
  })
  storageState = createStorageState()
  ChatStorageWorker.set(mockRpc)
})
