import type { ChatState } from '../ChatState/ChatState.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'

export const clearInput = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerValue: '',
  }
}
