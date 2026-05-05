import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { GitBranch, ParsedMessage, Project } from '../ViewModel/ViewModel.ts'
import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { setState } from '../ModelState/ModelState.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

export interface OpenMockSessionOptions {
  readonly branchName?: string
  readonly lastActiveTime?: string
  readonly projectId?: string
  readonly workspaceUri?: string
}

export interface OpenMockSessionState extends PrototypeStateBase {
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerAttachmentsHeight: number
  readonly gitBranches: readonly GitBranch[]
  readonly gitBranchPickerErrorMessage: string
  readonly gitBranchPickerOpen: boolean
  readonly gitBranchPickerVisible: boolean
  readonly parsedMessages: readonly ParsedMessage[]
  readonly projects: readonly Project[]
  readonly renamingSessionId: string
  readonly uid: number
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

export const openMockSession = async <TState extends OpenMockSessionState>(
  state: TState,
  mockSessionId: string,
  mockChatMessages: readonly ChatMessage[],
  options?: OpenMockSessionOptions,
): Promise<TState> => {
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

  const nextState = await refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: mockSessionId,
    sessions,
    viewMode: 'detail',
  })
  setState(state.uid, nextState)
  return nextState as TState
}
