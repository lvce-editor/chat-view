import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { setState } from '../ModelState/ModelState.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'
import type { GitBranch, ParsedMessage, Project } from '../ViewModel/ViewModel.ts'
import { ensureSubscribed } from '../HandleRpcSubmit/EnsureSubscribed/EnsureSubscribed.ts'

export interface HandleClickListState extends PrototypeStateBase {
  readonly chatListExpanded: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerAttachmentsHeight: number
  readonly gitBranches: readonly GitBranch[]
  readonly gitBranchPickerErrorMessage: string
  readonly gitBranchPickerOpen: boolean
  readonly gitBranchPickerVisible: boolean
  readonly headerHeight: number
  readonly height: number
  readonly lastNormalViewMode: 'list' | 'detail'
  readonly listFocusedIndex: number
  readonly listFocusOutline: boolean
  readonly listItemHeight: number
  readonly messagesAutoScrollEnabled: boolean
  readonly messagesScrollTop: number
  readonly parsedMessages: readonly ParsedMessage[]
  readonly projects: readonly Project[]
  readonly renamingSessionId: string
  readonly width: number
  readonly x: number
  readonly y: number
}

const getListIndex = (state: HandleClickListState, eventX: number, eventY: number): number => {
  const { headerHeight, height, listItemHeight, width, x, y } = state
  const relativeX = eventX - x
  const relativeY = eventY - y - headerHeight
  if (relativeX < 0 || relativeY < 0 || relativeX >= width || relativeY >= height - headerHeight) {
    return -1
  }
  return Math.floor(relativeY / listItemHeight)
}

const getSessionIndexFromListIndex = (listIndex: number, sessionCount: number, expanded: boolean): number => {
  if (listIndex < 0) {
    return -1
  }
  if (sessionCount <= 3) {
    return listIndex < sessionCount ? listIndex : -1
  }
  if (listIndex < 3) {
    return listIndex
  }
  if (listIndex === 3) {
    return -1
  }
  if (!expanded) {
    return -1
  }
  const sessionIndex = listIndex - 1
  return sessionIndex < sessionCount ? sessionIndex : -1
}

const getListFocusState = (state: HandleClickListState): HandleClickListState => {
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
    listFocusOutline: false,
  }
}

const selectSessionFromList = async (state: HandleClickListState, sessionIndex: number): Promise<HandleClickListState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  if (sessionIndex < 0 || sessionIndex >= visibleSessions.length) {
    return getListFocusState(state)
  }
  const sessionId = visibleSessions[sessionIndex].id
  const loadedSession = await getChatSession(sessionId)
  const composerAttachments = await getComposerAttachments(sessionId)
  const nextSessions = loadedSession
    ? state.sessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }
        return toSummarySession(loadedSession)
      })
    : state.sessions
  const messages = loadedSession?.messages || []
  const parsedMessages = await parseAndStoreMessagesContent(state.parsedMessages, messages)
  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, state.width),
    focus: 'list',
    focused: true,
    lastNormalViewMode: state.viewMode === 'chat-focus' ? state.lastNormalViewMode : 'detail',
    listFocusedIndex: sessionIndex,
    listFocusOutline: false,
    messages,
    messagesAutoScrollEnabled: true,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: sessionId,
    sessions: nextSessions,
    viewMode: state.viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  })
}

export const handleClickList = async (state: HandleClickListState, eventX: number, eventY: number): Promise<HandleClickListState> => {
  const listIndex = getListIndex(state, eventX, eventY)
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  const sessionIndex = getSessionIndexFromListIndex(listIndex, visibleSessions.length, state.chatListExpanded)
  const nextState =
    sessionIndex === -1 ? getListFocusState(state) : await selectSessionFromList(state, sessionIndex)
  setState(state.uid, nextState)
  if (sessionIndex !== -1) {
    await ensureSubscribed(state.uid, nextState.selectedSessionId)
  }
  await RendererWorker.invoke('Chat.rerenderWithQuery', state.uid)
  return nextState
}