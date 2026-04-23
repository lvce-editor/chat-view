import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleInputBlur = async (state: ChatState, name: string): Promise<ChatState> => {
  if (name !== InputName.Composer) {
    return state
  }
  if (state.focus !== 'composer' || !state.focused) {
    return state
  }
  return {
    ...state,
    focused: false,
  }
}
