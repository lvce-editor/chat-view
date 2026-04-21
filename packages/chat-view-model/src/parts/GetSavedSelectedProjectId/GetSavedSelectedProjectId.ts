import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedSelectedProjectId = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { selectedProjectId } = savedState as Partial<SavedState>
  if (typeof selectedProjectId !== 'string') {
    return undefined
  }
  return selectedProjectId
}
