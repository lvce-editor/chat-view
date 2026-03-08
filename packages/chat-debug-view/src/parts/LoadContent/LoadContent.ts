import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { listChatViewEvents } from '../IndexedDb/ListChatViewEvents.ts'
import { parseChatDebugUri } from '../ParseChatDebugUri/ParseChatDebugUri.ts'

const getInvalidUriMessage = (uri: string): string => {
  if (!uri) {
    return 'Unable to load debug session: missing URI. Expected format: chat-debug://<sessionId>.'
  }
  return `Unable to load debug session: invalid URI "${uri}". Expected format: chat-debug://<sessionId>.`
}

const getSessionNotFoundMessage = (sessionId: string): string => {
  return `No chat session found for sessionId "${sessionId}".`
}

const getFailedToLoadMessage = (sessionId: string): string => {
  return `Failed to load chat debug session "${sessionId}". Please try again.`
}

export const loadContent = async (state: ChatDebugViewState): Promise<ChatDebugViewState> => {
  const { databaseName, dataBaseVersion, eventStoreName, sessionIdIndexName, uri } = state
  let sessionId = ''
  try {
    sessionId = parseChatDebugUri(uri)
  } catch {
    return {
      ...state,
      errorMessage: getInvalidUriMessage(uri),
      events: [],
      initial: false,
      sessionId,
    }
  }

  try {
    const events = await listChatViewEvents(sessionId, databaseName, dataBaseVersion, eventStoreName, sessionIdIndexName)
    if (events.length === 0) {
      return {
        ...state,
        errorMessage: getSessionNotFoundMessage(sessionId),
        events: [],
        initial: false,
        sessionId,
      }
    }
    return {
      ...state,
      errorMessage: '',
      events,
      initial: false,
      sessionId,
    }
  } catch {
    return {
      ...state,
      errorMessage: getFailedToLoadMessage(sessionId),
      events: [],
      initial: false,
      sessionId,
    }
  }
}
