import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatSessionStorage } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { clear } from './Clear/Clear.ts'
import { deleteSession } from './DeleteSession/DeleteSession.ts'
import { getSession } from './GetSession/GetSession.ts'
import { listSessions } from './ListSessions/ListSessions.ts'
import { setSession } from './SetSession/SetSession.ts'

interface State {
  readonly databaseName: string
  readonly databaseVersion: number
  readonly storeName: string
  databasePromise: Promise<IDBDatabase> | undefined
}

interface IndexedDbChatSessionStorageOptions {
  readonly databaseName?: string
  readonly databaseVersion?: number
  readonly storeName?: string
}

export class IndexedDbChatSessionStorage implements ChatSessionStorage {
  private state: State

  constructor(options: IndexedDbChatSessionStorageOptions = {}) {
    this.state = {
      databaseName: options.databaseName || 'lvce-chat-view-sessions',
      databaseVersion: options.databaseVersion || 1,
      storeName: options.storeName || 'chat-sessions',
      databasePromise: undefined,
    }
  }

  private getDatabasePromise = (): Promise<IDBDatabase> | undefined => {
    return this.state.databasePromise
  }

  private setDatabasePromise = (databasePromise: Readonly<Promise<IDBDatabase>>): void => {
    this.state.databasePromise = databasePromise
  }

  async clear(): Promise<void> {
    return clear(
      this.getDatabasePromise,
      this.setDatabasePromise,
      this.state.databaseName,
      this.state.databaseVersion,
      this.state.storeName,
    )
  }

  async deleteSession(id: string): Promise<void> {
    return deleteSession(
      this.getDatabasePromise,
      this.setDatabasePromise,
      this.state.databaseName,
      this.state.databaseVersion,
      this.state.storeName,
      id,
    )
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return getSession(
      this.getDatabasePromise,
      this.setDatabasePromise,
      this.state.databaseName,
      this.state.databaseVersion,
      this.state.storeName,
      id,
    )
  }

  async listSessions(): Promise<readonly ChatSession[]> {
    return listSessions(
      this.getDatabasePromise,
      this.setDatabasePromise,
      this.state.databaseName,
      this.state.databaseVersion,
      this.state.storeName,
    )
  }

  async setSession(session: ChatSession): Promise<void> {
    return setSession(
      this.getDatabasePromise,
      this.setDatabasePromise,
      this.state.databaseName,
      this.state.databaseVersion,
      this.state.storeName,
      session,
    )
  }
}
