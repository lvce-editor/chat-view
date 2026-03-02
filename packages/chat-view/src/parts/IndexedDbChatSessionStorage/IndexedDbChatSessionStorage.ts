import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatSessionStorage } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { clear } from './Clear/Clear.ts'
import { deleteSession } from './DeleteSession/DeleteSession.ts'
import { getSession } from './GetSession/GetSession.ts'
import { listSessions } from './ListSessions/ListSessions.ts'
import { setSession } from './SetSession/SetSession.ts'

export class IndexedDbChatSessionStorage implements ChatSessionStorage {
  private databasePromise: Promise<IDBDatabase> | undefined

  private getDatabasePromise = (): Promise<IDBDatabase> | undefined => {
    return this.databasePromise
  }

  private setDatabasePromise = (databasePromise: Readonly<Promise<IDBDatabase>>): void => {
    this.databasePromise = databasePromise
  }

  async clear(): Promise<void> {
    return clear(this.getDatabasePromise, this.setDatabasePromise)
  }

  async deleteSession(id: string): Promise<void> {
    return deleteSession(this.getDatabasePromise, this.setDatabasePromise, id)
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return getSession(this.getDatabasePromise, this.setDatabasePromise, id)
  }

  async listSessions(): Promise<readonly ChatSession[]> {
    return listSessions(this.getDatabasePromise, this.setDatabasePromise)
  }

  async setSession(session: ChatSession): Promise<void> {
    return setSession(this.getDatabasePromise, this.setDatabasePromise, session)
  }
}
