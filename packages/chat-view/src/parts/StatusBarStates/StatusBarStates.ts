import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { syncChatStorageChangeListener } from '../ChatSessionStorage/ChatSessionStorage.ts'

const { get, getCommandIds, registerCommands, set: setState, wrapCommand, wrapGetter } = ViewletRegistry.create<ChatState>()

export { get, getCommandIds, registerCommands, wrapCommand, wrapGetter }

export const set = (uid: number, oldState: ChatState, newState: ChatState): void => {
  setState(uid, oldState, newState)
  void syncChatStorageChangeListener(uid, newState.selectedSessionId)
}
