import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { listChatViewEvents } from '../IndexedDb/ListChatViewEvents.ts'

export const loadContent = async (state: ChatDebugViewState): Promise<ChatDebugViewState> => {
  const { databaseName, dataBaseVersion, eventStoreName, sessionId, sessionIdIndexName } = state
  const events = await listChatViewEvents(sessionId, databaseName, dataBaseVersion, eventStoreName, sessionIdIndexName)
  return {
    ...state,
    events,
    initial: false,
  }
}
