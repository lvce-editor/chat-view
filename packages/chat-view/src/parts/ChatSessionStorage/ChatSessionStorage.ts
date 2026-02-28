import type { ChatSession } from '../ChatSession/ChatSession.ts'

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

let chatSessionStorage: Readonly<ChatSessionStorage> = new InMemoryChatSessionStorage()

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