import type { ChatState } from '../ChatState/ChatState.ts'
import { defaultAgentMode } from '../AgentMode/AgentMode.ts'
import { clearChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'
import { resetRelativeTimeNowForTest } from '../RelativeTimeNow/RelativeTimeNow.ts'
import { withUpdatedDisplayMessages } from '../UpdateDisplayMessages/UpdateDisplayMessages.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  await clearChatSessions()
  resetRelativeTimeNowForTest()
  return withUpdatedDisplayMessages({
    ...state,
    agentMode: defaultAgentMode,
    agentModePickerOpen: false,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    composerHeight: getMinComposerHeightForState(state),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
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
  })
}
