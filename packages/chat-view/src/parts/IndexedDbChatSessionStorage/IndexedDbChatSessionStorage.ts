import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatSessionStorage } from '../ChatSessionStorage/ChatSessionStorage.ts'

const LVCE_CHAT_SESSIONS_DB_NAME = 'lvce-chat-view-sessions'
const LVCE_CHAT_SESSIONS_DB_VERSION = 1
const LVCE_CHAT_SESSIONS_STORE = 'chat-sessions'

const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error
  }
  return new Error('IndexedDB request failed')
}

const requestToPromise = async <T>(createRequest: () => IDBRequest<T>): Promise<T> => {
  const request = createRequest()
  const { promise, reject, resolve } = Promise.withResolvers<T>()
  request.addEventListener('success', () => {
    resolve(request.result)
  })
  request.addEventListener('error', () => {
    reject(toError(request.error))
  })
  return promise
}

const transactionToPromise = async (createTransaction: () => IDBTransaction): Promise<void> => {
  const transaction = createTransaction()
  const { promise, reject, resolve } = Promise.withResolvers<void>()
  transaction.addEventListener('complete', () => {
    resolve()
  })
  transaction.addEventListener('error', () => {
    reject(toError(transaction.error))
  })
  transaction.addEventListener('abort', () => {
    reject(toError(transaction.error))
  })
  return promise
}

const openSessionsDatabase = async (): Promise<IDBDatabase> => {
  const request = indexedDB.open(LVCE_CHAT_SESSIONS_DB_NAME, LVCE_CHAT_SESSIONS_DB_VERSION)
  request.addEventListener('upgradeneeded', () => {
    const database = request.result
    if (!database.objectStoreNames.contains(LVCE_CHAT_SESSIONS_STORE)) {
      database.createObjectStore(LVCE_CHAT_SESSIONS_STORE, {
        keyPath: 'id',
      })
    }
  })
  return requestToPromise(() => request)
}

export class IndexedDbChatSessionStorage implements ChatSessionStorage {
  private databasePromise: Promise<IDBDatabase> | undefined

  private async getDatabase(): Promise<IDBDatabase> {
    if (!this.databasePromise) {
      this.databasePromise = openSessionsDatabase()
    }
    return this.databasePromise
  }

  async clear(): Promise<void> {
    const database = await this.getDatabase()
    const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const createTransaction = (): IDBTransaction => transaction
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    store.clear()
    await transactionToPromise(createTransaction)
  }

  async deleteSession(id: string): Promise<void> {
    const database = await this.getDatabase()
    const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const createTransaction = (): IDBTransaction => transaction
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    store.delete(id)
    await transactionToPromise(createTransaction)
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    const database = await this.getDatabase()
    const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readonly')
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    const result = await requestToPromise(() => store.get(id))
    return result
  }

  async listSessions(): Promise<readonly ChatSession[]> {
    const database = await this.getDatabase()
    const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readonly')
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    const result = await requestToPromise(() => store.getAll())
    return result
  }

  async setSession(session: ChatSession): Promise<void> {
    const database = await this.getDatabase()
    const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const createTransaction = (): IDBTransaction => transaction
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    store.put(session)
    await transactionToPromise(createTransaction)
  }
}
