import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedChatFocusSidebarWidth = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { chatFocusSidebarWidth } = savedState as Partial<SavedState>
  if (typeof chatFocusSidebarWidth !== 'number') {
    return undefined
  }
  return chatFocusSidebarWidth
}
