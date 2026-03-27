import * as Diff from '../Diff/Diff.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { newState, oldState } = StatusBarStates.get(uid)
  return Diff.diff(oldState, newState)
}
