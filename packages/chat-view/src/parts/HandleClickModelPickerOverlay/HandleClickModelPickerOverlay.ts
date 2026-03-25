import type { ChatState } from '../ChatState/ChatState.ts'
import { handleModelInputBlur } from '../HandleModelInputBlur/HandleModelInputBlur.ts'

export const handleClickModelPickerOverlay = async (state: ChatState): Promise<ChatState> => {
  return handleModelInputBlur(state)
}
