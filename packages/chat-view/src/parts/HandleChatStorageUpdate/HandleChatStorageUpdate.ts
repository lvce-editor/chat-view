import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession, getChatViewEvents } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'
import { get, set } from '../StatusBarStates/StatusBarStates.ts'
import { toFinalMessages } from '../ToFinalMessages/ToFinalMessages.ts'

const getNextSelectedSessionId = (sessions: readonly ChatSession[], selectedSessionId: string): string => {
  if (selectedSessionId && sessions.some((session) => session.id === selectedSessionId)) {
    return selectedSessionId
  }
  if (sessions.length === 0) {
    return ''
  }
  return sessions[0].id
}

export const handleChatStorageUpdate = async (uid: number, sessionId: string): Promise<void> => {
  const liveState = get(uid)?.newState
  if (!liveState) {
    return
  }
  const {
    composerAttachments: currentComposerAttachments,
    messagesScrollTop: currentMessagesScrollTop,
    parsedMessages: currentParsedMessages,
    selectedSessionId: currentSelectedSessionId,
    sessions: currentSessions,
    viewMode: currentViewMode,
    width,
  } = liveState
  const events = await getChatViewEvents(sessionId)
  if (events.length === 0) {
    return
  }
  const loadedSession = await getChatSession(sessionId)
  const eventMessages = toFinalMessages(events)
  const sessions = loadedSession
    ? currentSessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }
        return {
          ...loadedSession,
          messages: eventMessages,
        }
      })
    : currentSessions.filter((session) => session.id !== sessionId)
  const selectedSessionId = getNextSelectedSessionId(sessions, currentSelectedSessionId)
  let composerAttachments = currentComposerAttachments
  let parsedMessages = currentParsedMessages
  const messagesScrollTop = currentMessagesScrollTop
  let viewMode = currentViewMode
  if (selectedSessionId) {
    const selectedSession = getSelectedSession(sessions, selectedSessionId)
    if (selectedSession) {
      composerAttachments = await getComposerAttachments(selectedSessionId)
      const { messages } = selectedSession
      parsedMessages = await parseAndStoreMessagesContent(parsedMessages, messages)
    }
  }
  if (!selectedSessionId) {
    viewMode = 'list'
    composerAttachments = []
  }
  const nextState: ChatState = await refreshGitBranchPickerVisibility({
    ...liveState,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    messagesScrollTop,
    parsedMessages,
    selectedSessionId,
    sessions,
    viewMode: sessions.length === 0 || !selectedSessionId ? 'list' : viewMode,
  })
  set(uid, liveState, nextState)
  console.log({ nextState })
  await RendererWorker.invoke('Chat.rerender')
}
