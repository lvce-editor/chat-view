import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'
import { isReasoningEffort, type ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'

export const getSavedReasoningEffort = (savedState: unknown): ReasoningEffort | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { reasoningEffort } = savedState as Partial<SavedState>
  if (typeof reasoningEffort !== 'string') {
    return undefined
  }
  if (!isReasoningEffort(reasoningEffort)) {
    return undefined
  }
  return reasoningEffort
}
