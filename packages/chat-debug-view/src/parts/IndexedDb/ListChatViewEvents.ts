/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { requestToPromise } from './RequestToPromise.ts'

const openDatabase = async (databaseName: string, dataBaseVersion: number): Promise<IDBDatabase> => {
  const request = indexedDB.open(databaseName, dataBaseVersion)
  return requestToPromise(() => request)
}

const getAllEvents = async (store: Readonly<IDBObjectStore>): Promise<readonly ChatViewEvent[]> => {
  const all = await requestToPromise(() => store.getAll())
  return all as readonly ChatViewEvent[]
}

const filterEventsBySessionId = (events: readonly ChatViewEvent[], sessionId: string): readonly ChatViewEvent[] => {
  return events.filter((event) => event.sessionId === sessionId)
}

const getEventsBySessionId = async (
  store: Readonly<IDBObjectStore>,
  sessionId: string,
  sessionIdIndexName: string,
): Promise<readonly ChatViewEvent[]> => {
  if (store.indexNames.contains(sessionIdIndexName)) {
    const index = store.index(sessionIdIndexName)
    const events = await requestToPromise(() => index.getAll(IDBKeyRange.only(sessionId)))
    return filterEventsBySessionId(events as readonly ChatViewEvent[], sessionId)
  }
  const all = await getAllEvents(store)
  return filterEventsBySessionId(all, sessionId)
}

export const listChatViewEvents = async (sessionId: string): Promise<readonly ChatViewEvent[]> => {
export const listChatViewEvents = async (
  sessionId: string,
  databaseName: string,
  dataBaseVersion: number,
  eventStoreName: string,
  sessionIdIndexName: string,
): Promise<readonly ChatViewEvent[]> => {
  if (typeof indexedDB === 'undefined') {
    return []
  }
  const database = await openDatabase(databaseName, dataBaseVersion)
  try {
    if (!database.objectStoreNames.contains(eventStoreName)) {
      return []
    }
    const transaction = database.transaction(eventStoreName, 'readonly')
    const store = transaction.objectStore(eventStoreName)
    if (!sessionId) {
      return []
    }
    return getEventsBySessionId(store, sessionId, sessionIdIndexName)
  } finally {
    database.close()
  }
}
