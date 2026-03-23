import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedSystemPrompt = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { systemPrompt } = savedState as Partial<SavedState>
  if (typeof systemPrompt !== 'string') {
    return undefined
  }
  return systemPrompt
}
