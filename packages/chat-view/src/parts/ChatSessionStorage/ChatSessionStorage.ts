import type { ChatSession } from '../ChatSession/ChatSession.ts'

const LVCE_CHAT_SESSIONS_DB_NAME = 'lvce-chat-view-sessions'
const LVCE_CHAT_SESSIONS_DB_VERSION = 1
const LVCE_CHAT_SESSIONS_STORE = 'chat-sessions'

export interface ChatSessionStorage {
  clear(): Promise<void>
  deleteSession(id: string): Promise<void>
  getSession(id: string): Promise<ChatSession | undefined>
  listSessions(): Promise<readonly ChatSession[]>
  setSession(session: ChatSession): Promise<void>
}

class InMemoryChatSessionStorage implements ChatSessionStorage {
  private readonly sessions = new Map<string, ChatSession>()

  async clear(): Promise<void> {
    this.sessions.clear()
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions.delete(id)
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return this.sessions.get(id)
  }

  async listSessions(): Promise<readonly ChatSession[]> {
    return [...this.sessions.values()]
  }

  async setSession(session: ChatSession): Promise<void> {
    this.sessions.set(session.id, session)
  }
}

const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error
  }
  return new Error('IndexedDB request failed')
}

const requestToPromise = async <T>(createRequest: () => IDBRequest<T>): Promise<T> => {
  const request = createRequest()
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => {
      resolve(request.result)
    })
    request.addEventListener('error', () => {
      reject(toError(request.error))
    })
  })
}

const transactionToPromise = async (createTransaction: () => IDBTransaction): Promise<void> => {
  const transaction = createTransaction()
  return new Promise((resolve, reject) => {
    transaction.addEventListener('complete', () => {
      resolve()
    })
    transaction.addEventListener('error', () => {
      reject(toError(transaction.error))
    })
    transaction.addEventListener('abort', () => {
      reject(toError(transaction.error))
    })
  })
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

class IndexedDbChatSessionStorage implements ChatSessionStorage {
  private databasePromise: Promise<IDBDatabase> | undefined

  private async getDatabase(): Promise<IDBDatabase> {
    if (!this.databasePromise) {
      this.databasePromise = openSessionsDatabase()
    }
    return this.databasePromise
  }

  async clear(): Promise<void> {
    const database = await this.getDatabase()
    const createTransaction = (): IDBTransaction => database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const transaction = createTransaction()
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    store.clear()
    await transactionToPromise(createTransaction)
  }

  async deleteSession(id: string): Promise<void> {
    const database = await this.getDatabase()
    const createTransaction = (): IDBTransaction => database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const transaction = createTransaction()
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
    const createTransaction = (): IDBTransaction => database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
    const transaction = createTransaction()
    const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
    store.put(session)
    await transactionToPromise(createTransaction)
  }
}

const createDefaultStorage = (): Readonly<ChatSessionStorage> => {
  if (typeof indexedDB === 'undefined') {
    return new InMemoryChatSessionStorage()
  }
  return new IndexedDbChatSessionStorage()
}

let chatSessionStorage: Readonly<ChatSessionStorage> = createDefaultStorage()

export const setChatSessionStorage = (storage: Readonly<ChatSessionStorage>): void => {
  chatSessionStorage = storage
}

export const resetChatSessionStorage = (): void => {
  chatSessionStorage = new InMemoryChatSessionStorage()
}

export const listChatSessions = async (): Promise<readonly ChatSession[]> => {
  const sessions = await chatSessionStorage.listSessions()
  return sessions.map((session) => ({
    id: session.id,
    messages: [],
    title: session.title,
  }))
}

export const getChatSession = async (id: string): Promise<ChatSession | undefined> => {
  const session = await chatSessionStorage.getSession(id)
  if (!session) {
    return undefined
  }
  return {
    id: session.id,
    messages: [...session.messages],
    title: session.title,
  }
}

export const saveChatSession = async (session: ChatSession): Promise<void> => {
  await chatSessionStorage.setSession({
    id: session.id,
    messages: [...session.messages],
    title: session.title,
  })
}

export const deleteChatSession = async (id: string): Promise<void> => {
  await chatSessionStorage.deleteSession(id)
}

export const clearChatSessions = async (): Promise<void> => {
  await chatSessionStorage.clear()
}
