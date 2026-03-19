import type { ChatState } from '../ChatState/ChatState.ts'

export const setNewChatModelPickerEnabled = (state: ChatState, newChatModelPickerEnabled: boolean): ChatState => {
  return {
    ...state,
    modelPickerOpen: newChatModelPickerEnabled ? state.modelPickerOpen : false,
    modelPickerSearchValue: newChatModelPickerEnabled ? state.modelPickerSearchValue : '',
    newChatModelPickerEnabled,
  }
}
