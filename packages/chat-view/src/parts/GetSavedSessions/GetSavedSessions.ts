import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedSessions = (savedState: unknown): SavedState['sessions'] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { sessions } = savedState as Partial<SavedState>
  if (!Array.isArray(sessions)) {
    return undefined
  }
  return sessions
}
