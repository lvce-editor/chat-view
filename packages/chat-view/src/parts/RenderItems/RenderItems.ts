import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatVirtualDom } from '../GetChatViewDom/GetChatViewDom.ts'

export const renderItems = (oldState: ChatState, newState: ChatState): any => {
  const { composerValue, initial, models, selectedModelId, selectedSessionId, sessions, uid, viewMode } = newState
  if (initial) {
    return [ViewletCommand.SetDom2, uid, []]
  }
  const dom = getChatVirtualDom(sessions, selectedSessionId, composerValue, viewMode, models, selectedModelId)
  return [ViewletCommand.SetDom2, uid, dom]
}
