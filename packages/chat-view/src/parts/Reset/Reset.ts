import type { ChatState } from '../ChatState/ChatState.ts'
import { clearChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  await clearChatSessions()
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    mockAiResponseDelay: 0,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, state.models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    openApiApiKey: '',
    openRouterApiKey: '',
    openRouterApiKeyInput: '',
    selectedModelId: 'test',
    selectedSessionId: '',
    sessions: [],
    streamingEnabled: false,
    viewMode: 'list',
    visibleModels: state.models,
  }
}
