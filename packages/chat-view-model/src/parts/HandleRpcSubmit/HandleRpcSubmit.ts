import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { getBasicChatTools } from '../GetBasicChatTools/GetBasicChatTools.ts'
import { setState } from '../ModelState/ModelState.ts'
import { createNewSession } from './CreateNewSession/CreateNewSession.ts'
import { ensureSubscribed } from './EnsureSubscribed/EnsureSubscribed.ts'
import { getAuthAccessToken } from './GetAuthAccessToken/GetAuthAccessToken.ts'
import { getBackendUrl } from './GetBackendUrl/GetBackendUrl.ts'
import { getComposerAttachments } from './GetComposerAttachments/GetComposerAttachments.ts'
import { getCoordinatorModelId } from './GetCoordinatorModelId/GetCoordinatorModelId.ts'
import { getNextChatInputHistory } from './GetNextChatInputHistory/GetNextChatInputHistory.ts'
import { useMockApiEnabled } from './UseMockApiEnabled/UseMockApiEnabled.ts'
import { useOwnBackendEnabled } from './UseOwnBackendEnabled/UseOwnBackendEnabled.ts'

// const handleSubmitWithExistingSession

const defaultMaxToolCalls = 100

const getNewSessionTitle = (userText: string): string => {
  return userText.slice(0, 30)
}

export const handleRpcSubmit = async (state: Readonly<PrototypeState>): Promise<void> => {
  const {
    agentMode = 'agent',
    chatInputHistory,
    composerValue,
    openApiApiKey,
    selectedModelId,
    selectedSessionId,
    sessions,
    systemPrompt,
    toolEnablement,
    uid,
    viewMode,
  } = state
  const userText = composerValue.trim()
  if (!userText) {
    return
  }

  const shouldCreateNewSession = !selectedSessionId || viewMode === 'list'

  // TODO there is a race condition when the user submits another query
  // while the session is being created
  let actualSessionId = selectedSessionId
  const title = getNewSessionTitle(userText)
  if (shouldCreateNewSession) {
    actualSessionId = await createNewSession(title)
  }
  const newSessions = shouldCreateNewSession
    ? [
        ...sessions,
        {
          id: actualSessionId,
          messages: [], // TODO remove this from here
          title,
        },
      ]
    : sessions
  const nextState: PrototypeState = {
    ...state,
    chatInputHistory: getNextChatInputHistory(chatInputHistory, userText),
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    lastSubmittedSessionId: actualSessionId,
    messages: shouldCreateNewSession ? [] : state.messages,
    selectedSessionId: actualSessionId,
    sessions: newSessions,
    viewMode: 'detail',
  }

  setState(uid, nextState)

  await ensureSubscribed(uid, actualSessionId)

  const backendUrl = getBackendUrl(nextState)
  const shouldSyncBackendAuth = !!backendUrl && (useOwnBackendEnabled(nextState) || !!getAuthAccessToken(nextState))
  const authState = shouldSyncBackendAuth ? await syncBackendAuth(backendUrl) : undefined
  const effectiveState = authState
    ? {
        ...nextState,
        ...authState,
      }
    : nextState

  setState(uid, effectiveState)
  const coordinatorModelId = getCoordinatorModelId(state)
  constglectedModelId === 'test' && !us,
      modelId: coordinatorModelIdeMockApiEnabled(state)) {
    await ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', {
      text: `Mock AI response: I received "${userText}".`,
    })
  }
  try {
    await ChatCoordinatorWorker.invoke('ChatCoordinator.handleSubmit', {
      attachments: getComposerAttachments(state),
      authAccessToken: getAuthAccessToken(state),
      backendUrl: getBackendUrl(state),
      id: crypto.randomUUID(),
      modelId: coordinatorModelId,
      maxToolCalls: defaultMaxToolCalls,
      openAiKey: openApiApiKey || '',
      requestId: crypto.randomUUID(),
      role: 'user',
      sessionId: actualSessionId,
      systemPrompt: systemPrompt,
      text: userText,
      tools,
      useOwnBackend: useOwnBackendEnabled(state),
    })
  } catch (error) {
    console.error(error)
  }
}
