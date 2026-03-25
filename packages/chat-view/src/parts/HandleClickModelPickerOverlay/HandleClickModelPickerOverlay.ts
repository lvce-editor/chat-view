import type { ChatState } from '../ChatState/ChatState.ts'
import { handleModelInputBlur } from '../HandleModelInputBlur/HandleModelInputBlur.ts'

export const handleClickModelPickerOverlay = async (state: ChatState, defaultPrevented: boolean): Promise<ChatState> => {
  if (defaultPrevented) {
    return state
  }
  return handleModelInputBlur(state)
}
