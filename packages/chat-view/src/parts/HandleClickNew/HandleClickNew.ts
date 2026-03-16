import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { focusInput } from '../FocusInput/FocusInput.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  const newState = await createSession(state)
  return focusInput(newState)
}
