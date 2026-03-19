import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const setAndRerenderHandleTextChunkState = async (uid: number, previousState: ChatState, nextState: ChatState): Promise<void> => {
  set(uid, previousState, nextState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
}
