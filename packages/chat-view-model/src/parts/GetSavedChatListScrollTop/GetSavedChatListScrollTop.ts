import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedChatListScrollTop = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { chatListScrollTop } = savedState as Partial<SavedState>
  if (typeof chatListScrollTop !== 'number') {
    return undefined
  }
  return chatListScrollTop
}