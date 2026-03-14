import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedLastNormalViewMode = (savedState: unknown): 'list' | 'detail' | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { lastNormalViewMode } = savedState as Partial<SavedState>
  if (lastNormalViewMode !== 'list' && lastNormalViewMode !== 'detail') {
    return undefined
  }
  return lastNormalViewMode
}
