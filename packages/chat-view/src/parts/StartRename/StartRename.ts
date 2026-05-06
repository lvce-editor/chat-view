import type { ChatState } from '../ChatState/ChatState.ts'
import { renameSession } from '../RenameSession/RenameSession.ts'

export const startRename = async (state: ChatState, id: string): Promise<ChatState> => {
  const { sessions } = state
  const session = sessions.find((item) => item.id === id)
  if (!session) {
    return state
  }
  const renamedState = await renameSession(state, id, session.title)
  return {
    ...renamedState,
    selectedSessionId: id,
  }
}
