import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

interface OpenMockSessionOptions {
  readonly branchName?: string
  readonly lastActiveTime?: string
  readonly pinned?: boolean
  readonly projectId?: string
  readonly workspaceUri?: string
}

const applySessionOptions = (session: ChatSession, options: OpenMockSessionOptions | undefined): ChatSession => {
  if (!options) {
    return session
  }
  return {
    ...session,
    ...(options.branchName
      ? {
          branchName: options.branchName,
        }
      : {}),
    ...(options.lastActiveTime
      ? {
          lastActiveTime: options.lastActiveTime,
        }
      : {}),
    ...(options.pinned
      ? {
          pinned: true,
        }
      : {}),
    ...(options.projectId
      ? {
          projectId: options.projectId,
        }
      : {}),
    ...(options.workspaceUri
      ? {
          workspaceUri: options.workspaceUri,
        }
      : {}),
  }
}

export const openMockSession = async (
  state: ChatState,
  mockSessionId: string,
  mockChatMessages: readonly ChatMessage[],
  options?: OpenMockSessionOptions,
): Promise<ChatState> => {
  const { sessions: currentSessions } = state

  if (!mockSessionId) {
    return state
  }
  const parsedMessages = await parseAndStoreMessagesContent(state.parsedMessages, mockChatMessages)

  const existingSession = currentSessions.find((session) => session.id === mockSessionId)
  const sessions: readonly ChatSession[] = existingSession
    ? currentSessions.map((session) => {
        if (session.id !== mockSessionId) {
          return session
        }
        return applySessionOptions(
          {
            ...session,
            messages: mockChatMessages,
          },
          options,
        )
      })
    : [
        ...currentSessions,
        applySessionOptions(
          {
            id: mockSessionId,
            messages: mockChatMessages,
            title: mockSessionId,
          },
          options,
        ),
      ]

  const selectedSession = sessions.find((session) => session.id === mockSessionId)
  if (selectedSession) {
    await saveChatSession(selectedSession)
  }

  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: mockSessionId,
    sessions,
    viewMode: 'detail',
  })
}
