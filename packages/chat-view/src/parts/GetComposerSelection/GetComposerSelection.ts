import type { ChatState } from '../ChatState/ChatState.ts'
import { getNormalizedComposerSelection } from '../GetNormalizedComposerSelection/GetNormalizedComposerSelection.ts'

export const getComposerSelection = (state: ChatState): readonly [number, number] => {
  return getNormalizedComposerSelection(state.composerValue, state.composerSelectionStart, state.composerSelectionEnd)
}
