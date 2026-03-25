import type { ChatState } from '../ChatState/ChatState.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import { handleSearchValueChange } from '../HandleSearchValueChange/HandleSearchValueChange.ts'
import * as InputName from '../InputName/InputName.ts'
import { OpenApiApiKeyInput } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenRouterApiKeyInput } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

 
export const handleInput = async (state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  const { selectedSessionId } = state
  if (name === OpenApiApiKeyInput) {
    return {
      ...state,
      openApiApiKeyInput: value,
    }
  }
  if (name === OpenRouterApiKeyInput) {
    return {
      ...state,
      openRouterApiKeyInput: value,
    }
  }
  if (name === InputName.Search) {
    return handleSearchValueChange(state, value)
  }
  if (name === InputName.ModelPickerSearch) {
    const visibleModels = getVisibleModels(state.models, value)
    return {
      ...state,
      modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, visibleModels.length),
      modelPickerListScrollTop: 0,
      modelPickerSearchValue: value,
      visibleModels,
    }
  }
  if (name !== InputName.Composer) {
    return state
  }
  if (selectedSessionId) {
    await appendChatViewEvent({
      sessionId: selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-input',
      value,
    })
  }
  const composerHeight = await getComposerHeight(state, value)
  return {
    ...state,
    chatInputHistoryDraft: state.chatInputHistoryIndex === -1 ? value : state.chatInputHistoryDraft,
    composerHeight,
    composerSelectionEnd: value.length,
    composerSelectionStart: value.length,
    composerValue: value,
    inputSource,
  }
}
