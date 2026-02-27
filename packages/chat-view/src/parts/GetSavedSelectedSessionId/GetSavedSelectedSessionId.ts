import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedSelectedSessionId = (savedState: unknown) => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { selectedSessionId } = savedState as Partial<SavedState>
  if (typeof selectedSessionId !== 'string') {
    return undefined
  }
  return selectedSessionId
}
