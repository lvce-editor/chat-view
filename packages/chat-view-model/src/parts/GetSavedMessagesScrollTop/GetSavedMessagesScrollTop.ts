import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedMessagesScrollTop = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { messagesScrollTop } = savedState as Partial<SavedState>
  if (typeof messagesScrollTop !== 'number') {
    return undefined
  }
  return messagesScrollTop
}
