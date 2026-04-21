import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedSelectedSessionId = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { selectedSessionId } = savedState as Partial<SavedState>
  if (typeof selectedSessionId !== 'string') {
    return undefined
  }
  return selectedSessionId
}