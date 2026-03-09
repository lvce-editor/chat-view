import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diff = (oldState: ChatDebugViewState, newState: ChatDebugViewState): readonly number[] => {
  if (oldState.initial !== newState.initial) {
    return [DiffType.RenderCss, DiffType.RenderItems]
  }
  if (
    oldState.errorMessage !== newState.errorMessage ||
    oldState.events !== newState.events ||
    oldState.filterValue !== newState.filterValue ||
    oldState.sessionId !== newState.sessionId ||
    oldState.showInputEvents !== newState.showInputEvents ||
    oldState.showResponsePartEvents !== newState.showResponsePartEvents ||
    oldState.uid !== newState.uid
  ) {
    return [DiffType.RenderItems]
  }
  return []
}
