import type { ChatState } from '../ChatState/ChatState.ts'

export const handleModelChange = async (state: ChatState, value: string): Promise<ChatState> => {
  return {
    ...state,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    selectedModelId: value,
  }
}
