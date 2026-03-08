import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickSessionDebug = async (state: ChatState): Promise<ChatState> => {
  await RendererWorker.invoke('Main.openUri', `chat-debug://${state.selectedSessionId}`)
  return state
}
