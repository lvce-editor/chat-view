import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
import { saveChatSession, subscribeSessionUpdates } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getNextStateFromStorageUpdate } from '../HandleStorageUpdate/HandleStorageUpdate.ts'
import { getSubscribedSessionId, setState, setSubscribedSessionId } from '../ModelState/ModelState.ts'

const getComposerAttachments = (state: Readonly<PrototypeState>): readonly unknown[] => {
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

const createUserMessage = (userText: string): ChatMessage => {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    text: userText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

const createSubmittedUserMessage = (state: Readonly<PrototypeState>, userText: string): ChatMessage => {
  const attachments = getComposerAttachments(state)
  const userMessage = createUserMessage(userText)
  if (attachments.length === 0) {
    return userMessage
  }
  return {
    ...userMessage,
    attachments,
  }
}

const createSession = (state: Readonly<PrototypeState>, sessionId: string, userText: string): ChatSession => {
  return {
    id: sessionId,
    messages: [createUserMessage(userText)],
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

  const optimisticUserMessage = createSubmittedUserMessage(state, userText)

  let { selectedSessionId } = state
  let { sessions } = state
  const createdSessionFromList = !selectedSessionId || state.viewMode === 'list'

  if (createdSessionFromList) {
    selectedSessionId = crypto.randomUUID()
    const newSession = {
      ...createSession(state, selectedSessionId, userText),
      messages: [optimisticUserMessage],
    }
    await saveChatSession(newSession)
    sessions = [...state.sessions, newSession]
  } else {
    sessions = state.sessions.map((session) => {
      if (session.id !== selectedSessionId) {
        return session
      }
      return {
        ...session,
        messages: [...session.messages, optimisticUserMessage],
        status: 'in-progress',
      }
    })
  }

  await ensureSubscribed(state.uid, selectedSessionId)

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

  const shouldSyncBackendAuth = useOwnBackendEnabled(nextState) && !!getBackendUrl(nextState)
  const authState = shouldSyncBackendAuth ? await syncBackendAuth(getBackendUrl(nextState)) : undefined
  const effectiveState = authState
    ? {
        ...nextState,
        ...authState,
      }
    : nextState

  if (useMockApiEnabled(effectiveState)) {
    const optimisticState = await getNextStateFromStorageUpdate(effectiveState, selectedSessionId)
    setState(state.uid, optimisticState)
    void submitToCoordinator(optimisticState, selectedSessionId, userText).catch(() => {})
    return optimisticState
  }

  setState(state.uid, effectiveState)
  try {
    await submitToCoordinator(effectiveState, selectedSessionId, userText)
    const refreshedState = await getNextStateFromStorageUpdate(effectiveState, selectedSessionId)
    setState(state.uid, refreshedState)
    return refreshedState
  } catch {
    return effectiveState
  }
}
