import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeState, PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import type { ChatSession } from '../ViewModel/ViewModel.ts'
import { listChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { getState, setState } from '../ModelState/ModelState.ts'
import { normalizeSessionsOnLoad } from '../NormalizeSessionsOnLoad/NormalizeSessionsOnLoad.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

const getTargetSessionId = (
  state: {
    readonly lastSubmittedSessionId?: string
    readonly selectedSessionId: string
    readonly sessions: readonly ChatSession[]
    readonly viewMode: string
  },
  sessionId: string,
): string => {
  if (state.viewMode === 'list') {
    return state.lastSubmittedSessionId || sessionId
  }
  if (state.selectedSessionId === sessionId) {
    return state.selectedSessionId
  }
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession || selectedSession.messages.length === 0) {
    return sessionId
  }
  return state.selectedSessionId || sessionId
}

const shouldSwitchToDetailMode = (state: { readonly viewMode: string }, selectedSession?: ChatSession): boolean => {
  return state.viewMode === 'list' && !!selectedSession && selectedSession.messages.length > 0
}

export const getNextStateFromStorageUpdate = async (state: Readonly<PrototypeStateBase>, sessionId: string): Promise<PrototypeState> => {
  // TODO depending on list or detail view, need to load either
  // a list of chat sessions
  // or a list of chat messages for that sessionId
  const selectedSessionId = getTargetSessionId(state, sessionId)
  let sessions = (await listChatSessions()) as readonly ChatSession[]
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  sessions = normalizeSessionsOnLoad(sessions)
  const { parsedMessages: previousParsedMessages } = state

  let parsedMessages = previousParsedMessages
  for (const session of sessions) {
    parsedMessages = await parseAndStoreMessagesContent(parsedMessages, session.messages)
  }
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  return {
    ...state,
    parsedMessages,
    selectedSessionId: selectedSession?.id || selectedSessionId,
    sessions,
    viewMode: shouldSwitchToDetailMode(state, selectedSession) ? 'detail' : state.viewMode,
  }
}

const handleStorageUpdateListMode = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  // TODO update / requery list
  return state
}



const toMessages = (events: readonly any[]): readonly any[] => {
  const messages = []
  for (const event of events) {
    if (event.type === 'chat-message-added' && event.message && event.message.text) {
      messages.push({
        id: event.message.id,
        role: event.message.role,
        text: event.message.text,
        time: event.timestamp
      })
    }
    if (event.type === 'message' && event.message && event.message.content && event.message.content[0] && event.message.content[0].text) {
      messages.push({
        id: event.requestId,
        role: event.message.role,
        text: event.message.content[0].text,
        time: event.timestamp,
      })
    }
  }
  return messages
}

const getNewSessions = (state: PrototypeStateBase, messages: readonly any[]): readonly any[] => {
  // TODO store messages independent of sessions
  const newSessions = state.sessions.map((session) => {
    if (session.id === state.selectedSessionId) {
      return {
        ...session,
        messages,
      }
    }
    return session
  })
  if (newSessions.length === 0) {
    return [
      {
        id: state.selectedSessionId,
        messages,
      },
    ]
  }
  return newSessions
}

const handleStorageUpdateDetailMode = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  // TODO requery messages
  const { selectedSessionId } = state
  const events = await ChatStorageWorker.invoke('ChatStorage.getMessages', selectedSessionId)
  const messages = toMessages(events)

  console.log({ events })
  const parsedMessages = await parseAndStoreMessagesContent([], messages)
  // TODO store messages independent of sessions
  const newSessions = getNewSessions(state, messages)
  return {
    ...state,
    parsedMessages,
    sessions: newSessions,
  }
}

const getNextState = async (state: PrototypeStateBase): Promise<PrototypeStateBase> => {
  if (state.viewMode === 'detail') {
    return handleStorageUpdateDetailMode(state)
  }
  return handleStorageUpdateListMode(state)
}

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const state = getState(uid)
  if (!state) {
    return
  }
  console.log('storage update', uid, sessionId)
  const nextState = await getNextState(state)
  setState(uid, nextState)
  console.log({ nextState })
  await RendererWorker.invoke('Chat.rerenderWithQuery', uid)
}
