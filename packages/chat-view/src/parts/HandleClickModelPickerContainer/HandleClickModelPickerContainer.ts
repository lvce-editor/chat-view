import type { ChatState } from '../ChatState/ChatState.ts'
import { handleModelInputBlur } from '../HandleModelInputBlur/HandleModelInputBlur.ts'

export const handleClickModelPickerContainer = async (state: ChatState): Promise<ChatState> => {
  return handleModelInputBlur(state)
}
