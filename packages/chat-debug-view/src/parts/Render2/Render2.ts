import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as ChatDebugViewStates from '../State/ChatDebugViewStates.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly unknown[] => {
  const { newState, oldState } = ChatDebugViewStates.get(uid)
  ChatDebugViewStates.set(uid, newState, newState)
  return ApplyRender.applyRender(oldState, newState, diffResult)
}
