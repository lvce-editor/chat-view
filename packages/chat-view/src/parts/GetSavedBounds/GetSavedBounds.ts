import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export interface SavedBounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const getSavedBounds = (savedState: unknown): SavedBounds | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { x, y, width, height } = savedState as Partial<SavedState>
  if (typeof x !== 'number') {
    return undefined
  }
  if (typeof y !== 'number') {
    return undefined
  }
  if (typeof width !== 'number') {
    return undefined
  }
  if (typeof height !== 'number') {
    return undefined
  }
  return {
    height,
    width,
    x,
    y,
  }
}
