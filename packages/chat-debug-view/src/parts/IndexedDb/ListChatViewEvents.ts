/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
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

const getAllEvents = async (store: Readonly<IDBObjectStore>): Promise<readonly ChatViewEvent[]> => {
  const all = await requestToPromise(() => store.getAll())
  return all as readonly ChatViewEvent[]
}

const filterEventsBySessionId = (events: readonly ChatViewEvent[], sessionId: string): readonly ChatViewEvent[] => {
  return events.filter((event) => event.sessionId === sessionId)
}

const getEventsBySessionId = async (store: Readonly<IDBObjectStore>, sessionId: string): Promise<readonly ChatViewEvent[]> => {
  if (store.indexNames.contains(sessionIdIndexName)) {
    const index = store.index(sessionIdIndexName)
    const events = await requestToPromise(() => index.getAll(IDBKeyRange.only(sessionId)))
    return filterEventsBySessionId(events as readonly ChatViewEvent[], sessionId)
  }
  const all = await getAllEvents(store)
  return filterEventsBySessionId(all, sessionId)
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
      return []
    }
    return getEventsBySessionId(store, sessionId)
  } finally {
    database.close()
  }
}
