import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ViewModel/ViewModel.ts'
import { listChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { getState, setState } from '../ModelState/ModelState.ts'
import { normalizeSessionsOnLoad } from '../NormalizeSessionsOnLoad/NormalizeSessionsOnLoad.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

const shouldSwitchToDetailMode = (
  state: { readonly lastSubmittedSessionId?: string; readonly viewMode: string },
  selectedSession?: ChatSession,
): boolean => {
  if (state.viewMode !== 'list') {
    return false
  }
  if (!selectedSession) {
    return false
  }
  return state.lastSubmittedSessionId === selectedSession.id && selectedSession.messages.length > 0
}

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const state = getState(uid)
  if (!state) {
    return
  }
  const selectedSessionId = state.selectedSessionId || sessionId
  let sessions = (await listChatSessions()) as readonly ChatSession[]
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  sessions = normalizeSessionsOnLoad(sessions)
  const { parsedMessages: previousParsedMessages } = state
  let parsedMessages = previousParsedMessages
  for (const session of sessions) {
    parsedMessages = await parseAndStoreMessagesContent(parsedMessages, session.messages)
  }
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const nextState = {
    ...state,
    parsedMessages,
    selectedSessionId,
    sessions,
    viewMode: shouldSwitchToDetailMode(state, selectedSession) ? 'detail' : state.viewMode,
  }
  setState(uid, nextState)
  await RendererWorker.invoke('Chat.applyViewModelState', uid, nextState)
  await RendererWorker.invoke('Chat.rerender')
}
