import { RendererWorker } from '@lvce-editor/rpc-registry'
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

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const state = getState(uid)
  if (!state) {
    return
  }
  const nextState = await getNextStateFromStorageUpdate(state, sessionId)
  setState(uid, nextState)
  await RendererWorker.invoke('Chat.applyViewModelState', uid, nextState)
  await RendererWorker.invoke('Chat.rerender')
}
