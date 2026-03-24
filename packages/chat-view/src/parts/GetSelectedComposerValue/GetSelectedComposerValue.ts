import type { ChatState } from '../ChatState/ChatState.ts'
import { getNormalizedComposerSelection } from '../GetNormalizedComposerSelection/GetNormalizedComposerSelection.ts'

export const getSelectedComposerValue = (state: ChatState): string => {
  const { composerSelectionEnd, composerSelectionStart, composerValue } = state
  const [start, end] = getNormalizedComposerSelection(composerValue, composerSelectionStart, composerSelectionEnd)
  return composerValue.slice(start, end)
}
