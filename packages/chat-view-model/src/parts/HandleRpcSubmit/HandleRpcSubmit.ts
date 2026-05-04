import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
import { saveChatSession, subscribeSessionUpdates } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSubscribedSessionId, setState, setSubscribedSessionId } from '../ModelState/ModelState.ts'

const getNextChatInputHistory = (chatInputHistory: readonly string[], userText: string): readonly string[] => {
  return chatInputHistory.at(-1) === userText ? chatInputHistory : [...chatInputHistory, userText]
}

const createSession = (state: Readonly<PrototypeState>, sessionId: string): ChatSession => {
  return {
    id: sessionId,
    messages: [],
    ...(state.selectedProjectId
      ? {
          projectId: state.selectedProjectId,
        }
      : {}),
    status: 'in-progress',
    title: `Chat ${state.sessions.length + 1}`,
  }
}

const ensureSubscribed = async (uid: number, sessionId: string): Promise<void> => {
  if (getSubscribedSessionId(uid) === sessionId) {
    return
  }
  await subscribeSessionUpdates(uid, sessionId)
  setSubscribedSessionId(uid, sessionId)
}

const submitToCoordinator = async (state: Readonly<PrototypeState>, sessionId: string, userText: string): Promise<void> => {
  if (state.selectedModelId === 'test') {
    await ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', {
      text: `Mock AI response: I received "${userText}".`,
    })
  }
  await ChatCoordinatorWorker.invoke('ChatCoordinator.handleSubmit', {
    id: crypto.randomUUID(),
    modelId: state.selectedModelId,
    openAiKey: state.openApiApiKey || '',
    requestId: crypto.randomUUID(),
    role: 'user',
    sessionId,
    systemPrompt: state.systemPrompt,
    text: userText,
  })
}

export const handleRpcSubmit = async (state: Readonly<PrototypeState>): Promise<PrototypeState> => {
  const userText = state.composerValue.trim()
  if (!userText) {
    return state
  }

  let { selectedSessionId } = state
  let { sessions } = state
  const createdSessionFromList = !selectedSessionId || state.viewMode === 'list'

  if (createdSessionFromList) {
    selectedSessionId = crypto.randomUUID()
    const newSession = createSession(state, selectedSessionId)
    await saveChatSession(newSession)
    sessions = [...state.sessions, newSession]
  }

  await ensureSubscribed(state.uid, selectedSessionId)

  const viewMode = createdSessionFromList ? 'list' : state.viewMode

  const nextState: PrototypeState = {
    ...state,
    chatInputHistory: getNextChatInputHistory(state.chatInputHistory, userText),
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    lastSubmittedSessionId: selectedSessionId,
    selectedSessionId,
    sessions,
    viewMode: createdSessionFromList ? 'list' : state.viewMode,
  }

  setState(state.uid, nextState)
  await submitToCoordinator(nextState, selectedSessionId, userText)
  return nextState
}
