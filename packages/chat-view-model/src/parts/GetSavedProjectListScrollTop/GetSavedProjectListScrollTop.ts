import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedProjectListScrollTop = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projectListScrollTop } = savedState as Partial<SavedState>
  if (typeof projectListScrollTop !== 'number') {
    return undefined
  }
  return projectListScrollTop
}