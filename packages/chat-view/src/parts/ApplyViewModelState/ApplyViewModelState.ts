import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { get, set } from '../StatusBarStates/StatusBarStates.ts'

export const applyViewModelState = async (uid: number, newState: ChatState): Promise<void> => {
  const entry = get(uid)
  const oldState = entry?.newState || newState
  set(uid, oldState, newState)
  await RendererWorker.invoke('Chat.rerender')
}
