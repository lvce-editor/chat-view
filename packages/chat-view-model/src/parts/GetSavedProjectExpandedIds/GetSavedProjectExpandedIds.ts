import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedProjectExpandedIds = (savedState: unknown): readonly string[] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projectExpandedIds } = savedState as Partial<SavedState>
  if (!Array.isArray(projectExpandedIds)) {
    return undefined
  }
  const ids = projectExpandedIds.filter((id) => typeof id === 'string') as readonly string[]
  if (ids.length === 0) {
    return undefined
  }
  return ids
}
