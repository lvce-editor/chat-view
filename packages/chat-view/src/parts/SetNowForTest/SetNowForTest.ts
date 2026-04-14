import type { ChatState } from '../ChatState/ChatState.ts'
import { setRelativeTimeNowForTest } from '../RelativeTimeNow/RelativeTimeNow.ts'

export const setNowForTest = (state: ChatState, value: number): ChatState => {
  setRelativeTimeNowForTest(value)
  return state
}
