import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { saveChatSession, subscribeSessionUpdates } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getState, getSubscribedSessionId, setState, setSubscribedSessionId } from '../ModelState/ModelState.ts'

const getComposerAttachments = (state: Readonly<PrototypeState>): readonly ComposerAttachment[] => {
  const { composerAttachments } = state
  return Array.isArray(composerAttachments) ? composerAttachments : []
}

const useMockApiEnabled = (state: Readonly<PrototypeState>): boolean => {
  return Reflect.get(state, 'useMockApi') === true
}

const useOwnBackendEnabled = (state: Readonly<PrototypeState>): boolean => {
  return Reflect.get(state, 'useOwnBackend') === true
}

const getBackendUrl = (state: Readonly<PrototypeState>): string => {
  const backendUrl = Reflect.get(state, 'backendUrl')
  return typeof backendUrl === 'string' ? backendUrl : ''
}

const getAuthAccessToken = (state: Readonly<PrototypeState>): string => {
  const authAccessToken = Reflect.get(state, 'authAccessToken')
  return typeof authAccessToken === 'string' ? authAccessToken : ''
}

const getCoordinatorModelId = (state: Readonly<PrototypeState>): string => {
  return useMockApiEnabled(state) ? 'test' : state.selectedModelId
}

const getNextChatInputHistory = (chatInputHistory: readonly string[], userText: string): readonly string[] => {
  return chatInputHistory.at(-1) === userText ? chatInputHistory : [...chatInputHistory, userText]
}

const updateSessionStatus = (sessions: readonly ChatSession[], sessionId: string, status: ChatSession['status']): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== sessionId) {
      return session
    }
    return {
      ...session,
      status,
    }
  })
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
  const coordinatorModelId = getCoordinatorModelId(state)
  if (state.selectedModelId === 'test' && !useMockApiEnabled(state)) {
    await ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', {
      text: `Mock AI response: I received "${userText}".`,
    })
  }
  await ChatCoordinatorWorker.invoke('ChatCoordinator.handleSubmit', {
    attachments: getComposerAttachments(state),
    authAccessToken: getAuthAccessToken(state),
    backendUrl: getBackendUrl(state),
    id: crypto.randomUUID(),
    modelId: coordinatorModelId,
    openAiKey: state.openApiApiKey || '',
    requestId: crypto.randomUUID(),
    role: 'user',
    sessionId,
    systemPrompt: state.systemPrompt,
    text: userText,
    useOwnBackend: useOwnBackendEnabled(state),
  })
}

export const handleRpcSubmit = async (state: Readonly<PrototypeState>): Promise<PrototypeState> => {
  const userText = state.composerValue.trim()
  if (!userText) {
    return state
  }

  let { selectedSessionId } = state
  const createdSessionFromList = !selectedSessionId || state.viewMode === 'list'
  const initialSessions: readonly ChatSession[] = createdSessionFromList
    ? await (async (): Promise<readonly ChatSession[]> => {
        selectedSessionId = crypto.randomUUID()
        const newSession = createSession(state, selectedSessionId)
        await saveChatSession(newSession)
        return [...state.sessions, newSession]
      })()
    : state.sessions

  const sessions = createdSessionFromList ? initialSessions : updateSessionStatus(initialSessions, selectedSessionId, 'in-progress')

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
    viewMode: createdSessionFromList ? 'detail' : state.viewMode,
  }

  setState(state.uid, nextState)

  await ensureSubscribed(state.uid, selectedSessionId)

  const shouldSyncBackendAuth = useOwnBackendEnabled(nextState) && !!getBackendUrl(nextState)
  const authState = shouldSyncBackendAuth ? await syncBackendAuth(getBackendUrl(nextState)) : undefined
  const effectiveState = authState
    ? {
        ...nextState,
        ...authState,
      }
    : nextState

  setState(state.uid, effectiveState)
  try {
    await submitToCoordinator(effectiveState, selectedSessionId, userText)
    return (getState(state.uid) as PrototypeState | undefined) || effectiveState
  } catch {
    return effectiveState
  }
}
