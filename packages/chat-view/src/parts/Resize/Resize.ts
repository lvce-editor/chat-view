import type { ChatState } from '../ChatState/ChatState.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'

type GetComposerHeightFn = (state: ChatState, value: string, width: number) => Promise<number>

export const resize = async (state: ChatState, dimensions: any, getComposerHeightFn: GetComposerHeightFn = getComposerHeight): Promise<ChatState> => {
  const nextState = {
    ...state,
    ...dimensions,
  }
  if (dimensions.width !== undefined && dimensions.width !== state.width && nextState.composerValue) {
    return {
      ...nextState,
      composerHeight: await getComposerHeightFn(nextState, nextState.composerValue, nextState.width),
    }
  }
  return nextState
}
