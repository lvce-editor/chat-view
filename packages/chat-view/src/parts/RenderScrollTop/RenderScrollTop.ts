import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'

export const renderScrollTop = (oldState: ChatState, newState: ChatState): any => {
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetProperty, newState.uid, '.ChatList', 'scrollTop', newState.messagesScrollTop]
}
