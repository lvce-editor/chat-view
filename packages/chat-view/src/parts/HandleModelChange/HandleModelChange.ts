import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleModelChange = async (state: ChatState, value: string): Promise<ChatState> => {
  const { modelPickerHeaderHeight, models } = state
  return {
    ...state,
    agentModePickerOpen: false,
    modelPickerHeight: getModelPickerHeight(modelPickerHeaderHeight, models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    selectedModelId: value,
    visibleModels: models,
  }
}
