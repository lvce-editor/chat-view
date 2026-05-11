import type { ChatState } from '../ChatState/ChatState.ts'

export const startRename = async (state: ChatState, id: string): Promise<ChatState> => {
  const { sessions } = state
  const session = sessions.find((item) => item.id === id)
  if (!session) {
    return state
  }
  return {
    ...state,
    composerSelectionEnd: session.title.length,
    composerSelectionStart: session.title.length,
    composerValue: session.title,
    inputSource: 'script',
    listSelectedSessionId: id,
    renamingSessionId: id,
    selectedSessionId: id,
  }
}
