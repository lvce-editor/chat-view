import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

export const resetChatSessionStorage = (): void => {
  // no-op: chat session storage always goes through ChatStorageWorker
}

export const listChatSessions = async (): Promise<readonly ChatSession[]> => {
  const sessions = (await ChatStorageWorker.invoke('ChatStorage.listSessions')) as readonly ChatSession[]
  return sessions.map((session) => {
    const summary: ChatSession = {
      id: session.id,
      messages: [],
      title: session.title,
    }
    if (!session.projectId) {
      return summary
    }
    return {
      ...summary,
      projectId: session.projectId,
    }
  })
}

export const getChatSession = async (id: string): Promise<ChatSession | undefined> => {
  const session = (await ChatStorageWorker.invoke('ChatStorage.getSession', id)) as ChatSession | undefined
  if (!session) {
    return undefined
  }
  const resultBase: ChatSession = {
    id: session.id,
    messages: [...session.messages],
    title: session.title,
  }
  const result = session.projectId
    ? {
        ...resultBase,
        projectId: session.projectId,
      }
    : resultBase
  return result
}

export const saveChatSession = async (session: ChatSession): Promise<void> => {
  const value: ChatSession = {
    id: session.id,
    messages: [...session.messages],
    title: session.title,
  }
  const sessionValue = session.projectId
    ? {
        ...value,
        projectId: session.projectId,
      }
    : value
  await ChatStorageWorker.invoke('ChatStorage.setSession', sessionValue)
}

export const deleteChatSession = async (id: string): Promise<void> => {
  await ChatStorageWorker.deleteSession(id)
}

export const clearChatSessions = async (): Promise<void> => {
  await ChatStorageWorker.clear()
}

 
export const appendChatViewEvent = async (event: ChatViewEvent): Promise<void> => {
  await ChatStorageWorker.appendEvent(event)
}

export const getChatViewEvents = async (sessionId?: string): Promise<readonly ChatViewEvent[]> => {
  return ChatStorageWorker.getEvents(sessionId) as Promise<readonly ChatViewEvent[]>
}
