import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'

export const resetChatSessionStorage = (): void => {
  // no-op: chat session storage always goes through ChatStorageWorker
}

export const listChatSessions = async (): Promise<readonly ChatSession[]> => {
  const sessions = (await ChatStorageWorker.invoke('ChatStorage.listSessions')) as readonly ChatSession[]
  return sessions.map((session) => {
    const lastActiveTime = getSessionLastActiveTime(session)
    const summary: ChatSession = {
      ...(session.branchName
        ? {
            branchName: session.branchName,
          }
        : {}),
      id: session.id,
      ...(lastActiveTime
        ? {
            lastActiveTime,
          }
        : {}),
      messages: [],
      ...(session.pullRequestUrl
        ? {
            pullRequestUrl: session.pullRequestUrl,
          }
        : {}),
      ...(session.status
        ? {
            status: session.status,
          }
        : {}),
      title: session.title,
      ...(session.workspaceUri
        ? {
            workspaceUri: session.workspaceUri,
          }
        : {}),
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
  const lastActiveTime = getSessionLastActiveTime(session)
  const resultBase: ChatSession = {
    ...(session.branchName
      ? {
          branchName: session.branchName,
        }
      : {}),
    id: session.id,
    ...(lastActiveTime
      ? {
          lastActiveTime,
        }
      : {}),
    messages: [...session.messages],
    ...(session.pullRequestUrl
      ? {
          pullRequestUrl: session.pullRequestUrl,
        }
      : {}),
    ...(session.status
      ? {
          status: session.status,
        }
      : {}),
    title: session.title,
    ...(session.workspaceUri
      ? {
          workspaceUri: session.workspaceUri,
        }
      : {}),
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
  const lastActiveTime = getSessionLastActiveTime(session)
  const value: ChatSession = {
    ...(session.branchName
      ? {
          branchName: session.branchName,
        }
      : {}),
    id: session.id,
    ...(lastActiveTime
      ? {
          lastActiveTime,
        }
      : {}),
    messages: [...session.messages],
    ...(session.pullRequestUrl
      ? {
          pullRequestUrl: session.pullRequestUrl,
        }
      : {}),
    ...(session.status
      ? {
          status: session.status,
        }
      : {}),
    title: session.title,
    ...(session.workspaceUri
      ? {
          workspaceUri: session.workspaceUri,
        }
      : {}),
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
  // The local chat-view event union may temporarily grow ahead of the shared rpc-registry typings.
  await ChatStorageWorker.appendEvent(event as Parameters<typeof ChatStorageWorker.appendEvent>[0])
}

export const getChatViewEvents = async (sessionId?: string): Promise<readonly ChatViewEvent[]> => {
  return ChatStorageWorker.getEvents(sessionId) as Promise<readonly ChatViewEvent[]>
}

const activeChatStorageChangeListeners: Record<number, string> = Object.create(null)
const chatStorageChangeListenerSyncPromises: Record<number, Promise<void>> = Object.create(null)

export const syncChatStorageChangeListener = async (uid: number, sessionId: string): Promise<void> => {
  const previousPromise = chatStorageChangeListenerSyncPromises[uid]
  const initialPromise = previousPromise === undefined ? Promise.resolve() : previousPromise
  const nextPromise = initialPromise.then(async () => {
    const currentSessionId = activeChatStorageChangeListeners[uid] || ''
    if (currentSessionId === sessionId) {
      return
    }
    if (sessionId.length > 0) {
      activeChatStorageChangeListeners[uid] = sessionId
    } else {
      delete activeChatStorageChangeListeners[uid]
    }
    if (currentSessionId.length > 0) {
      await ChatStorageWorker.invoke('ChatStorage.unregisterChangeListener', uid, currentSessionId)
    }
    if (sessionId.length > 0) {
      await ChatStorageWorker.invoke('ChatStorage.registerChangeListener', uid, sessionId)
    }
  })
  chatStorageChangeListenerSyncPromises[uid] = nextPromise.catch(() => {})
  await nextPromise
}
