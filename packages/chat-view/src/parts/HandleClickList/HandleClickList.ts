import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { sessions } = state
  const index = getListIndex(state, eventX, eventY)
  if (index < 0) {
    return state
  }
  const session = sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
