import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickOpenApiApiKeySettings = async (state: ChatState): Promise<ChatState> => {
  // Open the built-in settings editor so the user can inspect or edit their OpenAI API key.
  await RendererWorker.invoke('Main.openUri', 'app://settings.json')
  return state
}
