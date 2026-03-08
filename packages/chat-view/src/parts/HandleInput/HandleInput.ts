import type { ChatState } from '../ChatState/ChatState.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'
import * as InputName from '../InputName/InputName.ts'
import { OpenApiApiKeyInput } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenRouterApiKeyInput } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const handleInput = async (state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
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
  if (name !== InputName.Composer) {
    return state
  }
  if (state.selectedSessionId) {
    await appendChatViewEvent({
      sessionId: state.selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-input',
      value,
    })
  }
  const composerHeight = await getComposerHeight(state, value)
  return {
    ...state,
    composerHeight,
    composerValue: value,
    inputSource,
  }
}
