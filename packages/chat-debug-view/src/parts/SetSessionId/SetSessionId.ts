import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { listChatViewEvents } from '../IndexedDb/ListChatViewEvents.ts'

export const setSessionId = async (state: ChatDebugViewState, sessionId: string): Promise<ChatDebugViewState> => {
  const events = await listChatViewEvents(sessionId, state.databaseName, state.dataBaseVersion, state.eventStoreName, state.sessionIdIndexName)
  return {
    ...state,
    events,
    initial: false,
    sessionId,
  }
}
