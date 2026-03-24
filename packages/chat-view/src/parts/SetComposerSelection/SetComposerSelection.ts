import type { ChatState } from '../ChatState/ChatState.ts'
import { getNormalizedComposerSelection } from '../GetNormalizedComposerSelection/GetNormalizedComposerSelection.ts'

export const setComposerSelection = (state: ChatState, composerSelectionStart: number, composerSelectionEnd: number): ChatState => {
  const [normalizedStart, normalizedEnd] = getNormalizedComposerSelection(state.composerValue, composerSelectionStart, composerSelectionEnd)
  return {
    ...state,
    composerSelectionEnd: normalizedEnd,
    composerSelectionStart: normalizedStart,
  }
}
