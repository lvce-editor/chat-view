import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { requestToPromise } from './RequestToPromise.ts'

const databaseName = 'lvce-chat-view-sessions'
const databaseVersion = 2
const eventStoreName = 'chat-view-events'
const sessionIdIndexName = 'sessionId'

const openDatabase = async (): Promise<IDBDatabase> => {
  const request = indexedDB.open(databaseName, databaseVersion)
  return requestToPromise(() => request)
}

const getAllEvents = async (store: IDBObjectStore): Promise<readonly ChatViewEvent[]> => {
  const all = await requestToPromise(() => store.getAll())
  return all as readonly ChatViewEvent[]
}

const getEventsBySessionId = async (store: IDBObjectStore, sessionId: string): Promise<readonly ChatViewEvent[]> => {
  if (store.indexNames.contains(sessionIdIndexName)) {
    const index = store.index(sessionIdIndexName)
    const events = await requestToPromise(() => index.getAll(IDBKeyRange.only(sessionId)))
    return events as readonly ChatViewEvent[]
  }
  const all = await getAllEvents(store)
  return all.filter((event) => event.sessionId === sessionId)
}

export const listChatViewEvents = async (sessionId: string): Promise<readonly ChatViewEvent[]> => {
  if (typeof indexedDB === 'undefined') {
    return []
  }
  const database = await openDatabase()
  try {
    if (!database.objectStoreNames.contains(eventStoreName)) {
      return []
    }
    const transaction = database.transaction(eventStoreName, 'readonly')
    const store = transaction.objectStore(eventStoreName)
    if (!sessionId) {
      return getAllEvents(store)
    }
    return getEventsBySessionId(store, sessionId)
  } finally {
    database.close()
  }
}
