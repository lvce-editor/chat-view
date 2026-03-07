import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'

export const renderScrollTop = (oldState: ChatState, newState: ChatState): any => {
  return [ViewletCommand.SetProperty, newState.uid, '.ChatMessages', 'scrollTop', newState.messagesScrollTop]
}
