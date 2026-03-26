import type { ChatState } from '../ChatState/ChatState.ts'
import { clearChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  await clearChatSessions()
  return {
    ...state,
    composerAttachments: [],
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
    reasoningEffortPickerOpen: false,
    runModePickerOpen: false,
    selectedModelId: 'test',
    selectedSessionId: '',
    sessions: [],
    streamingEnabled: false,
    viewMode: 'list',
    visibleModels: state.models,
  }
}
