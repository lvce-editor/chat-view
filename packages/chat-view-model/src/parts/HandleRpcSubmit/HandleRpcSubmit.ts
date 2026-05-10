import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { subscribeSessionUpdates } from '../ChatSessionStorage/ChatSessionStorage.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { getSubscribedSessionId, setState, setSubscribedSessionId } from '../ModelState/ModelState.ts'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'

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


const ensureSubscribed = async (uid: number, sessionId: string): Promise<void> => {
  if (getSubscribedSessionId(uid) === sessionId) {
    return
  }
  await subscribeSessionUpdates(uid, sessionId)
  setSubscribedSessionId(uid, sessionId)
}


// const handleSubmitWithExistingSession


const createNewSession = async (): Promise<string> => {
  const sessionId = crypto.randomUUID()
  const date = new Date()
  const timestamp = date.toISOString()
  await ChatCoordinatorWorker.invoke('ChatCoordinator.createSession', {
    sessionId,
    timestamp
  })
  return sessionId
}


export const handleRpcSubmit = async (state: Readonly<PrototypeState>): Promise<void> => {
  let { selectedSessionId, composerValue, viewMode, chatInputHistory, uid, systemPrompt, selectedModelId,
    openApiApiKey

  } = state
  const userText = composerValue.trim()
  if (!userText) {
    return
  }

  const shouldCeateNewSession = !selectedSessionId || viewMode === 'list'

  // TODO there is a race condition when the user submits another query
  // while the session is being created
  let actualSessionId = selectedSessionId
  if (shouldCeateNewSession) {
    actualSessionId = await createNewSession()
  }


  const nextState: PrototypeState = {
    ...state,
    chatInputHistory: getNextChatInputHistory(chatInputHistory, userText),
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    lastSubmittedSessionId: selectedSessionId,
    selectedSessionId,
    viewMode: 'detail',
  }

  setState(uid, nextState)


  await ensureSubscribed(uid, selectedSessionId)

  const shouldSyncBackendAuth = useOwnBackendEnabled(nextState) && !!getBackendUrl(nextState)
  const authState = shouldSyncBackendAuth ? await syncBackendAuth(getBackendUrl(nextState)) : undefined
  const effectiveState = authState
    ? {
      ...nextState,
      ...authState,
    }
    : nextState

  setState(uid, effectiveState)
  const coordinatorModelId = getCoordinatorModelId(state)
  if (selectedModelId === 'test' && !useMockApiEnabled(state)) {
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
    openAiKey: openApiApiKey || '',
    requestId: crypto.randomUUID(),
    role: 'user',
    sessionId: actualSessionId,
    systemPrompt: systemPrompt,
    text: userText,
    useOwnBackend: useOwnBackendEnabled(state),
  })


}
