import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { listChatViewEvents } from '../IndexedDb/ListChatViewEvents.ts'

export const refresh = async (state: ChatDebugViewState): Promise<ChatDebugViewState> => {
  const events = await listChatViewEvents(state.sessionId)
  return {
    ...state,
    events,
    initial: false,
  }
}
