import { getNormalizedComposerSelection } from '../GetNormalizedComposerSelection/GetNormalizedComposerSelection.ts'
import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedComposerSelection = (savedState: unknown, composerValue: string): readonly [number, number] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { composerSelectionEnd, composerSelectionStart } = savedState as Partial<SavedState>
  if (typeof composerSelectionStart !== 'number') {
    return undefined
  }
  if (typeof composerSelectionEnd !== 'number') {
    return undefined
  }
  return getNormalizedComposerSelection(composerValue, composerSelectionStart, composerSelectionEnd)
}