import type { ChatState } from '../ChatState/ChatState.ts'
import * as ChatListFocusFirst from '../ChatListFocusFirst/ChatListFocusFirst.ts'
import * as ChatListFocusLast from '../ChatListFocusLast/ChatListFocusLast.ts'
import * as ChatListFocusNext from '../ChatListFocusNext/ChatListFocusNext.ts'
import * as ChatListFocusPrevious from '../ChatListFocusPrevious/ChatListFocusPrevious.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SubmitRename from '../SubmitRename/SubmitRename.ts'

export const handleKeyDown = async (state: ChatState, key: string, shiftKey: boolean): Promise<ChatState> => {
  const { composerValue, renamingSessionId, selectedSessionId, sessions, viewMode } = state
  if (state.focus === 'list' && viewMode === 'list') {
    switch (key) {
      case 'ArrowDown':
        return ChatListFocusNext.chatListFocusNext(state)
      case 'ArrowUp':
        return ChatListFocusPrevious.chatListFocusPrevious(state)
      case 'Home':
        return ChatListFocusFirst.chatListFocusFirst(state)
      case 'End':
        return ChatListFocusLast.chatListFocusLast(state)
      default:
        break
    }
  }
  if (key !== 'Enter' || shiftKey) {
    return state
  }
  if (renamingSessionId) {
    return SubmitRename.submitRename(state)
  }
  const hasInput = composerValue.trim().length > 0
  const hasSelectedSession = sessions.some((session) => session.id === selectedSessionId)
  const submitState = viewMode === 'list' && hasInput && hasSelectedSession ? { ...state, viewMode: 'detail' as const } : state
  return HandleSubmit.handleSubmit(submitState)
}
