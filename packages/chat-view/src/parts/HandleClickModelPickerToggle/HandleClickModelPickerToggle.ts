import type { ChatState } from '../ChatState/ChatState.ts'
import { openModelPicker } from '../OpenModelPicker/OpenModelPicker.ts'

export const handleClickModelPickerToggle = async (state: ChatState): Promise<ChatState> => {
  return openModelPicker(state)
}
