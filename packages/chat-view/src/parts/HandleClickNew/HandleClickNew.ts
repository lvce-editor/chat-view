import type { ChatState } from '../ChatState/ChatState.ts'
import { clearInput } from '../ClearInput/ClearInput.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { focusInput } from '../FocusInput/FocusInput.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  const newState = await createSession(state)
  const clearedState = await clearInput(newState)
  return focusInput(clearedState)
}
