import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedProjectSidebarWidth = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projectSidebarWidth } = savedState as Partial<SavedState>
  if (typeof projectSidebarWidth !== 'number') {
    return undefined
  }
  return projectSidebarWidth
}
