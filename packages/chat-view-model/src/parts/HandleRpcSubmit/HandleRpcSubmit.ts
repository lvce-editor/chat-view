import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { setState } from '../ModelState/ModelState.ts'
import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
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

export const handleRpcSubmit = async (state: Readonly<PrototypeState>): Promise<void> => {
  const { chatInputHistory, composerValue, openApiApiKey, selectedModelId, selectedSessionId, systemPrompt, uid, viewMode } = state
  const userText = composerValue.trim()
  if (!userText) {
    return
  }

  const shouldCreateNewSession = !selectedSessionId || viewMode === 'list'

  // TODO there is a race condition when the user submits another query
  // while the session is being created
  let actualSessionId = selectedSessionId
  if (shouldCreateNewSession) {
    actualSessionId = await createNewSession()
  }

  const nextState: PrototypeState = {
    ...state,
    chatInputHistory: getNextChatInputHistory(chatInputHistory, userText),
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    lastSubmittedSessionId: actualSessionId,
    selectedSessionId: actualSessionId,
    viewMode: 'detail',
  }

  setState(uid, nextState)

  await ensureSubscribed(uid, actualSessionId)

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
