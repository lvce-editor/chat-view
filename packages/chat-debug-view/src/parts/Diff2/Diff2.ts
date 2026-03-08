import * as Diff from '../Diff/Diff.ts'
import * as ChatDebugViewStates from '../State/ChatDebugViewStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { newState, oldState } = ChatDebugViewStates.get(uid)
  return Diff.diff(oldState, newState)
}
