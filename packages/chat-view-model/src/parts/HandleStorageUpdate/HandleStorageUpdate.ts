import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ViewModel/ViewModel.ts'
import { listChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { getState, setState } from '../ModelState/ModelState.ts'

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const state = getState(uid)
  if (!state) {
    return
  }
  const selectedSessionId = state.selectedSessionId || sessionId
  let sessions = (await listChatSessions()) as readonly ChatSession[]
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  const nextState = {
    ...state,
    parsedMessages: [],
    selectedSessionId,
    sessions,
  }
  setState(uid, nextState)
  await RendererWorker.invoke('Chat.applyViewModelState', uid, nextState)
}
