import type { ChatState } from '../ChatState/ChatState.ts'
import { getMinComposerHeight } from '../GetMinComposerHeight/GetMinComposerHeight.ts'

export const getMinComposerHeightForState = (state: ChatState): number => {
  return getMinComposerHeight(state.composerLineHeight)
}
