import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedSelectedModelId = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { selectedModelId } = savedState as Partial<SavedState>
  if (typeof selectedModelId !== 'string') {
    return undefined
  }
  return selectedModelId
}
