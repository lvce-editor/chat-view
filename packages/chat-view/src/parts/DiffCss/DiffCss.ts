import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const isEqual = (oldState: StatusBarState, newState: StatusBarState): boolean => {
  return oldState.initial === newState.initial
}
