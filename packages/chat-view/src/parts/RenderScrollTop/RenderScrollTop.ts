import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'

export const renderScrollTop = (oldState: ChatState, newState: ChatState): any => {
  const { messagesScrollTop, uid } = newState
  return [ViewletCommand.SetProperty, uid, '.ChatMessages', 'scrollTop', messagesScrollTop]
}
