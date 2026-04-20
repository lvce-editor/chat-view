import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

const cloneMessage = (message: ChatMessage): ChatMessage => {
  return {
    ...message,
    ...(message.toolCalls
      ? {
          toolCalls: [...message.toolCalls],
        }
      : {}),
  }
}

const cloneSession = (session: ChatSession): ChatSession => {
  return {
    ...session,
    messages: session.messages.map(cloneMessage),
  }
}

const now = (): string => {
  return new Date().toISOString()
}

export const registerMockChatStorageRpc = (): ReturnType<typeof ChatStorageWorker.registerMockRpc> => {
  const sessions = new Map<string, ChatSession>()
  const events: ChatViewEvent[] = []

  return ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent': (event: ChatViewEvent) => {
      events.push(event)
    },
    'ChatStorage.clear': () => {
      sessions.clear()
      events.length = 0
    },
    'ChatStorage.deleteSession': (id: string) => {
      sessions.delete(id)
      events.push({
        sessionId: id,
        timestamp: now(),
        type: 'chat-session-deleted',
      })
    },
    'ChatStorage.getEvents': (sessionId?: string) => {
      if (!sessionId) {
        return [...events]
      }
      return events.filter((event) => event.sessionId === sessionId)
    },
    'ChatStorage.getSession': (id: string) => {
      const session = sessions.get(id)
      return session ? cloneSession(session) : undefined
    },
    'ChatStorage.listSessions': () => {
      return Array.from(sessions.values(), cloneSession)
    },
    'ChatStorage.subscribeSessionUpdates': () => {},
    'ChatStorage.setSession': (session: ChatSession) => {
      const previous = sessions.get(session.id)
      const nextSession = cloneSession(session)

      if (!previous) {
        events.push({
          sessionId: session.id,
          timestamp: now(),
          title: session.title,
          type: 'chat-session-created',
        })
        for (const message of session.messages) {
          events.push({
            message: cloneMessage(message),
            sessionId: session.id,
            timestamp: now(),
            type: 'chat-message-added',
          })
        }
        sessions.set(session.id, nextSession)
        return
        'ChatStorage.unsubscribeSessionUpdates': () => {},
      }

      if (previous.title !== session.title) {
        events.push({
          sessionId: session.id,
          timestamp: now(),
          title: session.title,
          type: 'chat-session-title-updated',
        })
      }

      const previousMessagesById = new Map(previous.messages.map((message) => [message.id, message]))
      for (const message of session.messages) {
        const previousMessage = previousMessagesById.get(message.id)
        if (!previousMessage) {
          events.push({
            message: cloneMessage(message),
            sessionId: session.id,
            timestamp: now(),
            type: 'chat-message-added',
          })
          continue
        }
        if (
          previousMessage.text !== message.text ||
          previousMessage.time !== message.time ||
          previousMessage.inProgress !== message.inProgress ||
          previousMessage.toolCalls !== message.toolCalls
        ) {
          events.push({
            inProgress: message.inProgress,
            messageId: message.id,
            sessionId: session.id,
            text: message.text,
            time: message.time,
            ...(message.toolCalls
              ? {
                  toolCalls: message.toolCalls,
                }
              : {}),
            timestamp: now(),
            type: 'chat-message-updated',
          })
        }
      }

      sessions.set(session.id, nextSession)
    },
    'ChatStorage.unsubscribeSessionUpdates': () => {},
  })
}
