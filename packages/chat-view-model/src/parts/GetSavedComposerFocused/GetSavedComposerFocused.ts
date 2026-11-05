import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedComposerFocused = (savedState: unknown): boolean => {
  if (!isObject(savedState)) {
    return false
  }
  const { composerFocused } = savedState as Partial<SavedState>
  return composerFocused === true
}
