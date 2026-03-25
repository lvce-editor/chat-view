import type { ChatState } from '../ChatState/ChatState.ts'
import { clearInput } from '../ClearInput/ClearInput.ts'
import { focusInput } from '../FocusInput/FocusInput.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  const clearedState = await clearInput(state)
  return focusInput({
    ...clearedState,
    lastNormalViewMode: 'list',
    renamingSessionId: '',
    viewMode: 'list',
  })
}
