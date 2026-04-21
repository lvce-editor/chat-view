import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import type { ReasoningEffort } from '../ViewModel/ViewModel.ts'

const isReasoningEffort = (value: string): value is ReasoningEffort => {
  return value === 'extra-high' || value === 'high' || value === 'medium' || value === 'low'
}

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
