import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatSessionStorage } from '../ChatSessionStorage/ChatSessionStorage.ts'

export class InMemoryChatSessionStorage implements ChatSessionStorage {
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
