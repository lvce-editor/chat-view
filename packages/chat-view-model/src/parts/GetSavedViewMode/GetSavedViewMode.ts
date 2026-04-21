import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import type { ChatViewMode } from '../ViewModel/ViewModel.ts'

export const getSavedViewMode = (savedState: unknown): ChatViewMode | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { viewMode } = savedState as Partial<SavedState>
  if (viewMode !== 'list' && viewMode !== 'detail' && viewMode !== 'chat-focus') {
    return undefined
  }
  return viewMode
}