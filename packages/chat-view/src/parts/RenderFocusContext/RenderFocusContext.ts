import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'

export const renderFocusContext = (oldState: ChatState, newState: ChatState): readonly any[] => {
  if (newState.focus === 'list' && newState.viewMode === 'list') {
    return [ViewletCommand.SetFocusContext, newState.uid, WhenExpression.FocusChatList]
  }
  return [ViewletCommand.SetFocusContext, newState.uid, WhenExpression.FocusChatInput]
}
