import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedComposerValue = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { composerValue } = savedState as Partial<SavedState>
  if (typeof composerValue !== 'string') {
    return undefined
  }
  return composerValue
}